import { Component, OnInit, inject } from '@angular/core';
import { Brand } from 'src/app/models/Brand';
import { BrandsService } from 'src/app/services/brands.service';

@Component({
  selector: 'app-select-brand',
  templateUrl: './select-brand.component.html',
  styleUrls: ['./select-brand.component.css']
})
export class SelectBrandComponent implements OnInit{
  brandService = inject(BrandsService);
  brandsArray: Array<Brand> = [];
  ngOnInit(): void {
      this.readBrands();
  }
  async readBrands(){
    const brandsAux = await this.getBrands();
      if(brandsAux != undefined){
        for(let i=0; i<brandsAux.length; i++){
          this.brandsArray.push(brandsAux[i]);
        }
      }
  }
  async getBrands(){
    try {
      const data = await this.brandService.getBrands().toPromise();
      console.log(data?.length);
      return data;
    } catch (error) {
      console.error('Error obteniendo datos:', error);
      throw error; // Puedes manejar el error de acuerdo a tus necesidades
    }
  }

  /*productService = inject(ProductService);
  productXpriceService = inject(PricesService);
  user: User = new User('', '', '', '', 0);
  brand: string = "";
  products: Array<Product> = [];

  getUser(){
    let userAux = localStorage.getItem('userLogged');
    let userdata: User = new User('', '', '', '', 0);
    if(userAux){
       userdata = JSON.parse(userAux);
    }
    return userdata;
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

  async filterBrands(brandAux: string){
    this.brand = brandAux;
    await this.readProducts('brand');
  }
  async filterAll(){
    await this.readProducts('all');
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
  async getProducts(): Promise<Product[] | undefined>{
    try {
      const data = await this.productService.getProducts().toPromise();
      console.log(data?.length);
      return data;
    } catch (error) {
      console.error('Error obteniendo datos:', error);
      throw error; // Puedes manejar el error de acuerdo a tus necesidades
    }
  }

  async readProducts(type: string): Promise<void> {
    let productsAux;
    switch(type){
      case 'brand':
        productsAux = await this.getByBrands(this.brand);
        break;
      default:
        productsAux = await this.getProducts();
        break;
    }
      if(productsAux != undefined){
        this.products = [];
        for(let i=0; i<productsAux.length; i++){
          productsAux[i].price = await this.setProductPrice(productsAux[i].id);
          this.products.push(productsAux[i]);
        }
      }
  }

  async getByBrands(brand: string){
    try {
      const data = await this.productService.getProductsByBrand(brand).toPromise();
      console.log(data?.length);
      return data;
    } catch (error) {
      console.error('Error obteniendo datos:', error);
      throw error; // Puedes manejar el error de acuerdo a tus necesidades
    }
  }*/
}
