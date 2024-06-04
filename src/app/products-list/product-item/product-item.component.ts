import { Component, OnInit, inject } from '@angular/core';
import { Product } from 'src/app/models/Product';
import { ProductService } from 'src/app/services/product.service';
import { ActivatedRoute, Params } from '@angular/router';
import { Feature } from 'src/app/models/Feature';
import { FeatureService } from 'src/app/services/feature.service';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.css']
})
export class ProductItemComponent implements OnInit{
  productService = inject(ProductService);
  featureService = inject(FeatureService);
  cartService = inject(CartService);
  cartProducts: Array<Product> = [];
  productSelected: Product = new Product('','',0,'',0,'',);
  allFeatures: Feature[]= [];
  activeRoute = inject(ActivatedRoute);
  async ngOnInit(): Promise<void> {
    await this.readProduct();
    await this.readFeatures();
    this.assignFeatures();
    this.cartService.getProducts().subscribe(cartProducts => {
      this.cartProducts = cartProducts;
    })
  }
  async readProduct(): Promise<void> {
    const id = this.activeRoute.snapshot.params['id'];
    if(id){
      let productAux = await this.getProduct(id);
      if(productAux != undefined){
        this.productSelected = productAux;
      }
    }
  }
  async readFeatures(): Promise<void> {
    let featuresAux = await this.getFeatures();
    if(featuresAux != undefined){
      this.allFeatures = featuresAux;
    }
  }
  async getProduct(id: string): Promise<Product | undefined>{
    try {
      const data = await this.productService.getProduct(id).toPromise();
      console.log(data?.id);
      return data;
    } catch (error) {
      console.error('Error obteniendo datos:', error);
      throw error; // Puedes manejar el error de acuerdo a tus necesidades
    }
  }
  async getFeatures(): Promise<Feature[] | undefined>{
    try {
      const data = await this.featureService.getFeatures().toPromise();
      console.log(data);
      return data;
    } catch (error) {
      console.error('Error obteniendo datos:', error);
      throw error; // Puedes manejar el error de acuerdo a tus necesidades
    }
  }
  assignFeatures(){
    let featuresSelected: Array<Feature> = [];
    for(let i=0; i<this.allFeatures.length; i++){
      if(this.allFeatures[i].product_id == this.productSelected.id){
        featuresSelected.push(this.allFeatures[i]);
      }
    }
    this.productSelected.features = featuresSelected;
  }
  addToCart(){
    this.cartService.addNewProduct(this.productSelected);
    
  }
  formatNumber(number: number): string {
    return number.toLocaleString(); // Esto añadirá separadores de miles
  }
  isOnCart(){
    let cartAux = localStorage.getItem("cart");
    if(cartAux){
      let cart: Array<Product> = JSON.parse(cartAux);
      let i=0;
      let access = false;
      while(i<cart.length && !access){
        if(cart[i].id == this.productSelected.id){
          access = true;
        }else{
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
}
