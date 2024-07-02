import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { Product } from '../models/Product';
import { BehaviorSubject, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private myAppUrl: string;
  private myApiUrl: string;
  private products: Array<Product> = [];
  private _products: BehaviorSubject<Product[]> = new BehaviorSubject<Product[]>([])
  constructor(private http: HttpClient) { 
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'api/Products/'
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
