import { Injectable } from '@angular/core';
import { OrderXproducts } from '../models/OrderXproduct';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrdersXProductsService {
  private myAppUrl: string;
  private myApiUrl: string;
  constructor(private http: HttpClient) { 
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'api/OrdersXproducts/'
  }
  getOrdersXproducts(): Observable<OrderXproducts[]> {
    return this.http.get<OrderXproducts[]>(this.myAppUrl + this.myApiUrl); 
  }
  getOrderXproducts(id: string): Observable<OrderXproducts> {
    return this.http.get<OrderXproducts>(this.myAppUrl + this.myApiUrl + id); 
  }
  deleteOrderXproducts(id: string): Observable<void> {
    return this.http.delete<void>(`${this.myAppUrl}${this.myApiUrl}${id}`);
  }
  deleteOrdersXproducts(): Observable<void> {
    return this.http.delete<void>(`${this.myAppUrl}${this.myApiUrl}`);
  }
  saveOrderXproducts(productAux: OrderXproducts): Observable<void>{
    return this.http.post<void>(`${this.myAppUrl}${this.myApiUrl}`, productAux);
  }
  updateOrderXproducts(id: string, productAux: OrderXproducts): Observable<void>{
    return this.http.patch<void>(`${this.myAppUrl}${this.myApiUrl}${id}`, productAux);
  }
}
