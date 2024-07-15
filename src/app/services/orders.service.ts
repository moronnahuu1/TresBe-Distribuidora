import { Injectable, inject } from '@angular/core';
import { Order } from '../models/Order';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserService } from './user.service';
import { User } from '../models/User';
import { OrdersXProductsService } from './orders-x-products.service';
import { OrderXproducts } from '../models/OrderXproduct';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  private myAppUrl: string;
  private myApiUrl: string;
  private orders: Order[] = [];
  private _orders: BehaviorSubject<Order[]> = new BehaviorSubject<Order[]>([]);
  userService = inject(UserService);
  user: User = this.userService.getUserLogged();
  _user: BehaviorSubject<User> = new BehaviorSubject<User>(this.user);
  oxpService = inject(OrdersXProductsService);
  oxps: OrderXproducts[] = [];
  _oxps: BehaviorSubject<OrderXproducts[]> = new BehaviorSubject<OrderXproducts[]>([]);
  constructor(private http: HttpClient) { 
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'api/Orders/'
  }
  changeUser(userAux: User){
    this.user = userAux;
    localStorage.setItem('searchedUser', JSON.stringify(true));
    this._user.next(this.user);
  }
  returnUser(){
    return this._user.asObservable();
  }
  async readOrders(){
    let ordersAux = await this.findUserOrders();
    if(ordersAux != undefined){
      if(ordersAux.length > 0){
        this.orders = ordersAux;
        this._orders.next(this.orders);
      }else{
      this.orders = [];
      this._orders.next(this.orders);
      }
    }else{
      this.orders = [];
      this._orders.next(this.orders);
    }
    return this._orders.asObservable();
  }
  async readOxp(){
    for(let i=0; i<this.orders.length; i++){
      (await this.oxpService.readOxp(this.orders[i].id)).subscribe(oxp => {
        this.oxps = oxp;
      });
      this._oxps.next(this.oxps);
    }
    return this._oxps.asObservable();
  }
  async findUserOrders(){
      try {
        const data = await this.getOrdersByID().toPromise();
        console.log(data?.length);
        return data;
      } catch (error) {
        console.error('Error obteniendo datos:', error);
        throw error; // Puedes manejar el error de acuerdo a tus necesidades
      }
  }
  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.myAppUrl + this.myApiUrl); 
  }
  getOrder(id: string): Observable<Order> {
    return this.http.get<Order>(this.myAppUrl + this.myApiUrl + id); 
  }
  getOrdersNotPayed(): Observable<Order[]> {
    let urlAux = this.myAppUrl + this.myApiUrl + 'user/debt/'
    return this.http.get<Order[]>(urlAux + this.user.id); 
  }
  getOrdersByID(){
    let urlAux = this.myAppUrl + this.myApiUrl + 'user/'
    return this.http.get<Order[]>(urlAux + this.user.id); 
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
