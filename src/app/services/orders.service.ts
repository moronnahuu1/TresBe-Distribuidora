import { Injectable } from '@angular/core';
import { Order } from '../models/Order';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  private myAppUrl: string;
  private myApiUrl: string;
  constructor(private http: HttpClient) { 
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'api/Orders/'
  }
  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.myAppUrl + this.myApiUrl); 
  }
  getOrder(id: string): Observable<Order> {
    return this.http.get<Order>(this.myAppUrl + this.myApiUrl + id); 
  }
  deleteOrder(id: string): Observable<void> {
    return this.http.delete<void>(`${this.myAppUrl}${this.myApiUrl}${id}`);
  }
  deleteOrders(): Observable<void> {
    return this.http.delete<void>(`${this.myAppUrl}${this.myApiUrl}`);
  }
  saveOrder(productAux: Order): Observable<void>{
    return this.http.post<void>(`${this.myAppUrl}${this.myApiUrl}`, productAux);
  }
  updateOrder(id: string, productAux: Order): Observable<void>{
    return this.http.patch<void>(`${this.myAppUrl}${this.myApiUrl}${id}`, productAux);
  }
}
