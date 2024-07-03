import { Injectable } from '@angular/core';
import { User } from '../models/User';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private myAppUrl: string;
  private myApiUrl: string;
  constructor(private http: HttpClient) { 
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'api/Users/'
  }
  getUserLogged(){
    let userAux = localStorage.getItem('userLogged');
    let userdata: User = new User('', '', '', '', 0);
    if(userAux){
       userdata = JSON.parse(userAux);
    }
    return userdata;
  }
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.myAppUrl + this.myApiUrl); 
  }
  getUser(id: string): Observable<User> {
    return this.http.get<User>(this.myAppUrl + this.myApiUrl + id); 
  }
  getUserByEmail(email: string): Observable<User> {
    let urlAux = this.myAppUrl + this.myApiUrl + "/email/";
    return this.http.get<User>(urlAux + email); 
  }
  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.myAppUrl}${this.myApiUrl}${id}`);
  }
  deleteUsers(): Observable<void> {
    return this.http.delete<void>(`${this.myAppUrl}${this.myApiUrl}`);
  }
  saveUser(productAux: User): Observable<void>{
    return this.http.post<void>(`${this.myAppUrl}${this.myApiUrl}`, productAux);
  }
  updateUser(id: string, productAux: User): Observable<void>{
    return this.http.patch<void>(`${this.myAppUrl}${this.myApiUrl}${id}`, productAux);
  }
}
