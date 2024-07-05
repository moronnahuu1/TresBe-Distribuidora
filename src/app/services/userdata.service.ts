import { Injectable } from '@angular/core';
import { Userdata } from '../models/Userdata';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserdataService {
  private myAppUrl: string;
  private myApiUrl: string;
  userdata: Userdata = new Userdata('','','','','','','','','','',0,'','');
  _userData: BehaviorSubject<Userdata> = new BehaviorSubject<Userdata>(this.userdata);
  constructor(private http: HttpClient) { 
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'api/userdata/'
  }
  async returnUserdata(userID: string){
    let userdataAux = await this.setUserdataID(userID);
    if(userdataAux){
      this.userdata = userdataAux;
      this._userData.next(this.userdata);
    }
    return this._userData.asObservable();
  }
  async returnUserID(id: string){
    let userdataAux = await this.getUserdataByID(id);
    if(userdataAux){
      this.userdata = userdataAux;
      this._userData.next(this.userdata);
    }
    return this._userData.asObservable();
  }
  async getUserdataByID(id: string){
    try {
      const data = await this.getUserdata(id).toPromise();
      console.log(data);
      return data;
    } catch (error) {
      console.error('Error obteniendo datos:', error);
      throw error; // Puedes manejar el error de acuerdo a tus necesidades
    }
  }
  async setUserdataID(userID: string){
    try {
      const data = await this.getUserdataByUserID(userID).toPromise();
      console.log(data);
      return data;
    } catch (error) {
      console.error('Error obteniendo datos:', error);
      throw error; // Puedes manejar el error de acuerdo a tus necesidades
    }
  }
  getUsersdata(): Observable<Userdata[]> {
    return this.http.get<Userdata[]>(this.myAppUrl + this.myApiUrl); 
  }
  getUserdata(id: string): Observable<Userdata> {
    return this.http.get<Userdata>(this.myAppUrl + this.myApiUrl + id); 
  }
  getUserdataByUserID(userid: string): Observable<Userdata> {
    let urlAux = this.myAppUrl + this.myApiUrl + "userid/";
    return this.http.get<Userdata>(urlAux + userid);
  }
  deleteUserdata(id: string): Observable<void> {
    return this.http.delete<void>(`${this.myAppUrl}${this.myApiUrl}${id}`);
  }
  deleteUsersdata(): Observable<void> {
    return this.http.delete<void>(`${this.myAppUrl}${this.myApiUrl}`);
  }
  saveUserdata(productAux: Userdata): Observable<void>{
    return this.http.post<void>(`${this.myAppUrl}${this.myApiUrl}`, productAux);
  }
  updateUserdata(id: string, productAux: Userdata): Observable<void>{
    return this.http.patch<void>(`${this.myAppUrl}${this.myApiUrl}${id}`, productAux);
  }
}
