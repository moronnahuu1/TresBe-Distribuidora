import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { Product } from '../models/Product';
import { BehaviorSubject, count, Observable } from 'rxjs';
import { PricesService } from './prices.service';
import { PriceXproduct } from '../models/PriceXproduct';
import { User } from '../models/User';
import { OptionsService } from './options.service';
import { Options } from '../models/Options';
import { BrandsService } from './brands.service';
import { CategoriesService } from './categories.service';
@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private myAppUrl: string;
  private myApiUrl: string;
  optionService = inject(OptionsService);
  brandService = inject(BrandsService);
  categoryService = inject(CategoriesService);
  categorySelected: string = '';
  brandSelected: string = 'all';
  pageNumber: number = 1;
  pageTotal: number = 0;
  _pageNumber: BehaviorSubject<number> = new BehaviorSubject<number>(this.pageNumber);
  _pageTotal: BehaviorSubject<number> = new BehaviorSubject<number>(this.pageTotal);

  options: Options[] = [];
   products: Array<Product> = [];
   _products: BehaviorSubject<Product[]> = new BehaviorSubject<Product[]>([]);
  productXpriceService = inject(PricesService);
  user: User = new User('', '', '', '', '');
  loading: boolean = false;
  _loading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.loading);
  constructor(private http: HttpClient) { 
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'api/Products/'
  }
  returnObservable(){
    return this._products.asObservable();
  }
  changeLoading(name: string){
    if(name == 'false'){
      this.loading = false;
    }else{
      this.loading = true;
    }
    this._loading.next(this.loading);
    return this._loading.asObservable();
  }
  getDiscounts(productAux: Product){
    if(productAux.discount != 0){
      productAux.priceDiscount = (productAux.price - (productAux.price * productAux.discount));
    }
    return productAux.priceDiscount;
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
      case 'search':
        if(value){
          productsAux = await this.searchProducts(value);
        }
        break;
      case 'rand':
        productsAux = await this.getRand();        
        break;
      default:
        productsAux = await this.setProducts(this.pageNumber);
        break;
    }
      if(productsAux != undefined){
        this.options = [];
        for(let i=0; i<productsAux.length; i++){
            (await this.optionService.readProductOptions(productsAux[i].id)).subscribe(products => {
            this.options = products;
          });
          if(this.options.length>0){
            productsAux[i].optionSelected = this.options[0].name;
            productsAux[i].price = await this.setProductPrice(this.options[0].id);
          }
          productsAux[i].priceDiscount = this.getDiscounts(productsAux[i]);
          this.products.push(productsAux[i]);
        }
        this._products.next(this.products);
        this.hasCostPrice();
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

  async getRand(){
    try {
      const data = await this.getRandomProducts().toPromise();      
      console.log(data?.length);
      return data;
    } catch (error) {
      console.error('Error obteniendo datos:', error);
      throw error; // Puedes manejar el error de acuerdo a tus necesidades
    }
  }
  
  async setProductPrice(optionID: string){
    let data = await this.getPrice(optionID);
    let priceAux: PriceXproduct = new PriceXproduct('','',0, 0,0,0,0,0,0);
    if(data != undefined){
      priceAux = data;
    }
    if(this.user.email == ''){
      return priceAux.priceList4;
    }else{
      switch(this.user.priceList){
        case '1':
          return priceAux.priceList1;
        case '2':
          return priceAux.priceList2;
        case '3':
          return priceAux.priceList3;
        case '4':
          return priceAux.priceList4;
        case 'E':
          return priceAux.priceListE;
        case 'G':
          return priceAux.priceListG;
        default:
          return priceAux.priceList1;
      }
    }
  }
  getUser(){
    let userAux = localStorage.getItem('userLogged');
    let userdata: User = new User('', '', '', '', '');
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
  async setProducts(page: number): Promise<Product[] | undefined>{
    try {
      const data = await this.getProducts(page).toPromise();
      console.log(data?.length);
      return data;
    } catch (error) {
      console.error('Error obteniendo datos:', error);
      throw error; // Puedes manejar el error de acuerdo a tus necesidades
    }
  }

  async searchProducts(name: string){
    try {
      this.brandService.getBrandSelected().subscribe(brandAux =>{
        this.brandSelected = brandAux;
      });
      this.categoryService.returnSelected().subscribe(category => {
        this.categorySelected = category;
      });
      const data = await this.getProductSearch(name).toPromise();
      console.log(data?.length);
      return data;
    } catch (error) {
      console.error('Error obteniendo datos:', error);
      throw error; // Puedes manejar el error de acuerdo a tus necesidades
    }
  }

  async returnOneProduct(id: string){
    let productAux = await this.getOneProduct(id);
    let productReturn: Product = new Product('','','','',0,'',0,'',0,0);
    if(productAux != undefined){
      productReturn = productAux;
    }
    return productReturn;
  }
  setPageNumber(page: number){
    this.pageNumber = page;
    this._pageNumber.next(this.pageNumber);
  }
  getCurrentPage(){
    return this._pageNumber.asObservable();
  }

  async getOneProduct(id: string){
    try {
      const data = await this.getProduct(id).toPromise();
      console.log(data);
      return data;
    } catch (error) {
      console.error('Error obteniendo datos:', error);
      throw error; // Puedes manejar el error de acuerdo a tus necesidades
    }
  }

  async readCounts(value: string, type: string){
    let countedAux = await this.countProductsTC(value, type);
    if(countedAux){
      this.pageTotal = countedAux;
      this._pageTotal.next(this.pageTotal);
    }
    return this._pageTotal.asObservable();
  }

  async countProductsTC(value: string, type: string){
    try {
      const data = await this.countProducts(value, type).toPromise();
      console.log(data);
      return data;
    } catch (error) {
      console.error('Error obteniendo datos:', error);
      throw error; // Puedes manejar el error de acuerdo a tus necesidades
    }
  }
  hasCostPrice(){
    for(let i=0; i<this.products.length; i++){
      if(this.products[i].price < 2){
        this.products.splice(i, 1);
      }
    }
    this._products.next(this.products);
   }
  
  getProducts(page: number): Observable<Product[]> {
    return this.http.get<Product[]>(this.myAppUrl + this.myApiUrl + 'page/'+ page); 
  }

  countProducts(value: string, type: string): Observable<number> {
    return this.http.get<number>(this.myAppUrl + this.myApiUrl + 'count/' + value + '/' + type); 
  }

  getRandomProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.myAppUrl + this.myApiUrl + 'random');
  }
  getProduct(id: string): Observable<Product> {
    return this.http.get<Product>(this.myAppUrl + this.myApiUrl + id); 
  }
  getProductSearch(name: string): Observable<Product[]> {
    let urlAux = this.myAppUrl + this.myApiUrl + 'search/';
    let type = 'brand';
    if(this.brandSelected == ''){
      this.brandSelected = 'all';
    }
    if(this.categorySelected != ''){
      type = 'category';
    }
    if(type == 'brand'){
      return this.http.get<Product[]>(urlAux + name + '/' + this.brandSelected + '/' + type);
    }else{
      return this.http.get<Product[]>(urlAux + name + '/' + this.categorySelected + '/' + type); 
    }
  }
  getProductsByBrand(brand: string): Observable<Product[]> {
    let urlAux = this.myAppUrl + this.myApiUrl + 'brand/'
    return this.http.get<Product[]>(urlAux + brand + '/' + this.pageNumber); 
  }
  getProductsByCategory(category: string): Observable<Product[]> {
    let urlAux = this.myAppUrl + this.myApiUrl + 'category/'
    return this.http.get<Product[]>(urlAux + category + '/' + this.pageNumber); 
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
