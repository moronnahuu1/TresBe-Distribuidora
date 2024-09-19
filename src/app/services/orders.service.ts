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
  returnOrders(){
    return this._orders.asObservable();
  }
  isAdmin(){
    if(localStorage.getItem('admin')){
      return true;
    }else{
      return false;
    }
  }
  async searchOrders(input: string){
    if(input != ''){
      if(!this.isAdmin()){
        let ordersSearched = await this.getSearchedOrdersUser(input);
        if(ordersSearched){
          this.orders = ordersSearched;
          this._orders.next(this.orders);
        }
      }else{
        let ordersSearched = await this.getSearchedOrders(input);
        if(ordersSearched){
          this.orders = ordersSearched;
          this._orders.next(this.orders);
        }
      }
    }else{
      if(this.isAdmin()){
        await this.readAdminOrders();
      }else{
        await this.readOrders();
      }
    }
    return this._orders.asObservable();
  }
  async readOneOrder(id: string){
    let orderAux = await this.readOneOrderTC(id);
    if(orderAux){
      return orderAux;
    }else{
      return null;
    }
  }
  async readOneOrderTC(id: string){
    try {
      const data = await this.getOrder(id).toPromise();
      console.log(data);
      return data;
    } catch (error) {
      console.error('Error obteniendo datos:', error);
      throw error; // Puedes manejar el error de acuerdo a tus necesidades
    }
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
      await this.readOxp()
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

  async readAdminOrders(){
    let ordersAux = await this.getAdminOrdersTC();
    if(ordersAux){
      this.orders = ordersAux;
      this._orders.next(this.orders);
    }
    return this._orders.asObservable();
  }

  async getAdminOrdersTC(){
    try {
      const data = await this.getOrdersAdmin().toPromise();
      console.log(data?.length);
      return data;
    } catch (error) {
      console.error('Error obteniendo datos:', error);
      throw error; // Puedes manejar el error de acuerdo a tus necesidades
    }
}

async getSearchedOrders(input: string){
  try {
    const data = await this.getOrdersSearched(input).toPromise();
    console.log(data?.length);
    return data;
  } catch (error) {
    console.error('Error obteniendo datos:', error);
    throw error; // Puedes manejar el error de acuerdo a tus necesidades
  }
}

async getSearchedOrdersUser(input: string){
  try {
    const data = await this.getOrdersSearchedNotAdmin(input, this.user.id).toPromise();
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
  getOrdersAdmin(){
    let urlAux = this.myAppUrl + this.myApiUrl;
    return this.http.get<Order[]>(urlAux + 'admin/attended'); 
  }
  getOrdersSearched(input: string){
    let urlAux = this.myAppUrl + this.myApiUrl;
    return this.http.get<Order[]>(urlAux + 'search/code/'+ input); 
  }
  getOrdersSearchedNotAdmin(input: string, userID: string){
    let urlAux = this.myAppUrl + this.myApiUrl;
    return this.http.get<Order[]>(urlAux + 'search/code/user/'+ input + '/'+ userID); 
  }
  deleteOrder(id: string): Observable<void> {
    return this.http.delete<void>(`${this.myAppUrl}${this.myApiUrl}${id}`);
  }
  deleteOrders(): Observable<void> {
    return this.http.delete<void>(`${this.myAppUrl}${this.myApiUrl}`);
  }
  saveOrder(productAux: Order, to: string, subject: string, html: string, htmlAux: string): Observable<void>{
    let urlAux = this.myAppUrl + this.myApiUrl;
    const emailData = {
      order: productAux,
      to: to,
      subject: subject,
      text: '', // Puedes dejar esto vacío si solo envías HTML
      html: html,
      htmlAux: htmlAux
  };
    return this.http.post<void>(urlAux, emailData);
  }
  updateOrder(id: string, productAux: Order): Observable<void>{
    return this.http.patch<void>(`${this.myAppUrl}${this.myApiUrl}${id}`, productAux);
  }
}
