import { Component, OnInit, inject } from '@angular/core';
import { Product } from 'src/app/models/Product';
import { ProductService } from 'src/app/services/product.service';
import { ActivatedRoute } from '@angular/router';
import { Feature } from 'src/app/models/Feature';
import { FeatureService } from 'src/app/services/feature.service';
import { CartService } from 'src/app/services/cart.service';
import { PricesService } from 'src/app/services/prices.service';
import { PriceXproduct } from 'src/app/models/PriceXproduct';
import { User } from 'src/app/models/User';
import { OptionsService } from 'src/app/services/options.service';
import { Options } from 'src/app/models/Options';

@Component({
  selector: 'app-product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.css']
})
export class ProductItemComponent implements OnInit{
  productService = inject(ProductService);
  productXpriceService = inject(PricesService);
  featureService = inject(FeatureService);
  cartService = inject(CartService);
  optionService = inject(OptionsService);
  options: Options[] = [];
  optionSelected = '';
  cartProducts: Array<Product> = [];
  productSelected: Product = new Product('','','','',0,'',0,'', 1);
  allFeatures: Feature[]= [];
  activeRoute = inject(ActivatedRoute);
  user: User = new User('', '', '', '', 0);
  onCart: Boolean = false;
  async ngOnInit(): Promise<void> {
    window.scrollTo(0,0);
    this.user = this.getUser();
    const id = this.activeRoute.snapshot.params['id'];
    this.productSelected = await this.productService.returnOneProduct(id);
    this.productSelected.priceDiscount = (this.productSelected.price - (this.productSelected.price * this.productSelected.discount));
    (await this.featureService.readProductFeatures(this.productSelected.id)).subscribe(features => {
      this.productSelected.features = features;
    });
    (await this.optionService.readProductOptions(this.productSelected.id)).subscribe(options => {
      this.options = options;
      if(options.length > 0){
        this.optionSelected = options[0].name;
        this.productSelected.optionSelected = this.optionSelected;
      }
    });
    this.cartService.getProducts().subscribe(cartProducts => {
      this.cartProducts = cartProducts;
    });
    this.isOnCart();
  }
  addToCart(){
    if(!this.isOnCart()){
      this.productSelected.quantity = 1;
      this.cartService.addNewProduct(this.productSelected, this.optionSelected);
    }
  }
  formatNumber(number: number): string {
    return number.toLocaleString(); // Esto añadirá separadores de miles
  }
  getOptionSelected(){
    let optionAux = document.getElementById('prodOptions') as HTMLSelectElement;
    if(optionAux){
      this.optionSelected = optionAux.value;
    }
  }
  isOnCart(){
    this.getOptionSelected();
    let cartAux = localStorage.getItem("cart");
    if(cartAux){
      let cart: Array<Product> = JSON.parse(cartAux);
      let i=0;
      let access = false;
      while(i<cart.length && !access){
        if(cart[i].id == this.productSelected.id){
          if(cart[i].optionSelected == this.optionSelected){
            access = true;
            this.onCart = true;
          }else{
            this.onCart = false;
            i++;
          }
        }else{
          this.onCart = false;
          i++;
        }
      }
      return access;
    }else{
      return false;
    }
  }
  isAdmin(){
    let access = localStorage.getItem("admin");
    let admin = false;
    if(access){
      admin = JSON.parse(access);
    }
    return admin;
  }
  async setProductPrice(productID: string){
    let data = await this.getPrice(productID);
    let priceAux: PriceXproduct = new PriceXproduct('','',0, 0,0,0);
    if(data != undefined){
      priceAux = data;
    }
    if(this.user.email == ''){
      return priceAux.priceList1;
    }else{
      switch(this.user.priceList){
        case 1:
          return priceAux.priceList1;
        case 2:
          return priceAux.priceList2;
        case 3:
          return priceAux.priceList3;
        case 4:
          return priceAux.priceList4;
        default:
          return priceAux.priceList1;
      }
    }
  }
  getUser(){
    let userAux = localStorage.getItem('userLogged');
    let userdata: User = new User('', '', '', '', 0);
    if(userAux){
       userdata = JSON.parse(userAux);
    }
    return userdata;
  }
  async getPrice(id: string){
    try {
      const data = await this.productXpriceService.getTableByProduct(id).toPromise();
      console.log(data);
      return data;
    } catch (error) {
      console.error('Error obteniendo datos:', error);
      throw error; // Puedes manejar el error de acuerdo a tus necesidades
    }
  }
}
