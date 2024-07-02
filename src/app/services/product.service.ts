import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { Product } from '../models/Product';
import { BehaviorSubject, Observable } from 'rxjs';
import { PricesService } from './prices.service';
import { PriceXproduct } from '../models/PriceXproduct';
import { User } from '../models/User';
@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private myAppUrl: string;
  private myApiUrl: string;
  private products: Array<Product> = [];
  private _products: BehaviorSubject<Product[]> = new BehaviorSubject<Product[]>([]);
  productXpriceService = inject(PricesService);
  user: User = new User('', '', '', '', 0);
  constructor(private http: HttpClient) { 
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'api/Products/'
  }
  async readProducts(type: string, value: string | null){
    this.user = this.getUser();
    let productsAux;
    this.products = [];
    switch(type){
      case 'brand':
        if(value != null){
          productsAux = await this.getByBrands(value);
        }
        break;
       case 'category':
        if(value != null){
          productsAux = await this.getByCategory(value);
        }
          break;
      default:
        productsAux = await this.setProducts();
        break;
    }
      if(productsAux != undefined){
        for(let i=0; i<productsAux.length; i++){
          productsAux[i].price = await this.setProductPrice(productsAux[i].id);
          this.products.push(productsAux[i]);
        }
        this._products.next(this.products);
      }
      return this._products.asObservable();
  }

  async getByCategory(category: string){
    try {
      const data = await this.getProductsByCategory(category).toPromise();
      console.log(data?.length);
      return data;
    } catch (error) {
      console.error('Error obteniendo datos:', error);
      throw error; // Puedes manejar el error de acuerdo a tus necesidades
    }
  }

  async getByBrands(brand: string){
    try {
      const data = await this.getProductsByBrand(brand).toPromise();
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
  async setProducts(): Promise<Product[] | undefined>{
    try {
      const data = await this.getProducts().toPromise();
      console.log(data?.length);
      return data;
    } catch (error) {
      console.error('Error obteniendo datos:', error);
      throw error; // Puedes manejar el error de acuerdo a tus necesidades
    }
  }
  
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.myAppUrl + this.myApiUrl); 
  }
  getProduct(id: string): Observable<Product> {
    return this.http.get<Product>(this.myAppUrl + this.myApiUrl + id); 
  }
  getProductsByBrand(brand: string): Observable<Product[]> {
    let urlAux = this.myAppUrl + this.myApiUrl + 'brand/'
    return this.http.get<Product[]>(urlAux + brand); 
  }
  getProductsByCategory(category: string): Observable<Product[]> {
    let urlAux = this.myAppUrl + this.myApiUrl + 'category/'
    return this.http.get<Product[]>(urlAux + category); 
  }
  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${this.myAppUrl}${this.myApiUrl}${id}`);
  }
  deleteProducts(): Observable<void> {
    return this.http.delete<void>(`${this.myAppUrl}${this.myApiUrl}`);
  }
  saveProduct(productAux: Product): Observable<void>{
    return this.http.post<void>(`${this.myAppUrl}${this.myApiUrl}`, productAux);
  }
  updateProduct(id: string, productAux: Product): Observable<void>{
    return this.http.patch<void>(`${this.myAppUrl}${this.myApiUrl}${id}`, productAux);
  }
}
