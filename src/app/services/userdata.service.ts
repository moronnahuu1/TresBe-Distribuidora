import { Injectable } from '@angular/core';
import { Userdata } from '../models/Userdata';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserdataService {
  private myAppUrl: string;
  private myApiUrl: string;
  constructor(private http: HttpClient) { 
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'api/userdata/'
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
