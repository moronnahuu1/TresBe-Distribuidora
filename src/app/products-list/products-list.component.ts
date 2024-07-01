import { Component, OnInit, inject } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Product } from '../models/Product';
import { ActivatedRoute } from '@angular/router';
import { PricesService } from '../services/prices.service';
import { PriceXproduct } from '../models/PriceXproduct';
import { User } from '../models/User';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.css']
})
export class ProductsListComponent implements OnInit{
  productsArray: Array<Product> = [];
  productXpriceService = inject(PricesService);
  productService = inject(ProductService);
  activeRoute = inject(ActivatedRoute);
  category: string = "";
  brand: string = "";
  user: User = new User('', '', '', '', 0);
  async ngOnInit() {
    this.user = this.getUser();
    await this.filters();
  }

  async filters(){
    const categoryAux = this.activeRoute.snapshot.params['category'];
    const brandAux = this.activeRoute.snapshot.params['brand'];
    if(brandAux){
      this.brand = brandAux;
      await this.readProducts('brand');
    }
    if(categoryAux){
      this.category = categoryAux;
      await this.readProducts('category');
    }
    if(!brandAux && !categoryAux){
      await this.readProducts("all");
    }
  }

  async readProducts(type: string): Promise<void> {
    let productsAux;
    switch(type){
      case 'brand':
        productsAux = await this.getByBrands(this.brand);
        break;
      case 'category':
        productsAux = await this.getByCategory(this.category);
        break;
      default:
        productsAux = await this.getProducts();
        break;
    }
      if(productsAux != undefined){
        for(let i=0; i<productsAux.length; i++){
          productsAux[i].price = await this.setProductPrice(productsAux[i].id);
          this.productsArray.push(productsAux[i]);
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
  }
  async getByCategory(category: string){
    try {
      const data = await this.productService.getProductsByCategory(category).toPromise();
      console.log(data?.length);
      return data;
    } catch (error) {
      console.error('Error obteniendo datos:', error);
      throw error; // Puedes manejar el error de acuerdo a tus necesidades
    }
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
  async filterByCategory(category: string){
    const productsAux = await this.getProducts();
      if(productsAux != undefined){
        for(let i=0; i<productsAux.length; i++){
          if(productsAux[i].category == category){
            this.productsArray.push(productsAux[i]);
          }
        }
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
  formatNumber(number: number): string {
    return number.toLocaleString(); // Esto añadirá separadores de miles
  }
}
