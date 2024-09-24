import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PublicUser } from '../models/PublicUser';

@Injectable({
  providedIn: 'root'
})
export class CookieService {
  private myAppUrl: string;
  private myApiUrl: string;
  user: PublicUser = new PublicUser('','','','', false);
  _user: BehaviorSubject<PublicUser> = new BehaviorSubject<PublicUser>(this.user);
  admin: PublicUser = new PublicUser('','','','', false);
  _admin: BehaviorSubject<PublicUser> = new BehaviorSubject<PublicUser>(this.admin);
  constructor(private http: HttpClient) { 
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'api/cookies/'
  }

  returnUser(){
    return this._user.asObservable();
  }

  returnAdmin(){
    return this._admin.asObservable();
  }

  async getAdmin(){
    let isLogged = await this.tokenExistTC('admin_token');
    if(isLogged){
      let userAux = await this.getTokenTC("admin_token");
      if(userAux != null){
        this.admin = userAux;
        this._admin.next(this.user)
      }
    }
    return this._admin.asObservable();
  }

  async getUser(){
    let isLogged = await this.tokenExistTC('access_token');
    if(isLogged){
      let userAux = await this.getTokenTC("access_token");
      if(userAux != null){
        this.user = userAux;
        this._user.next(this.user)
      }
    }
    return this._user.asObservable();
  }

  async getTokenTC(cookieName: string){
    let data = await this.getToken(cookieName).toPromise();
    if(data){
      return data;
    }else{
      return null;
    }
  }

  async tokenExistTC(cookieName: string){
    let tokenAux = await this.tokenExist(cookieName).toPromise();
    let exist: boolean = false;
    if(tokenAux != undefined){
      exist = tokenAux;
    }
    return exist;
  }

  tokenExist(cookieName: string): Observable<boolean> {
    return this.http.get<boolean>(this.myAppUrl + this.myApiUrl + 'check/' + cookieName, {
      withCredentials: true // Esto permite que las cookies se envíen y se reciban
    });
  }
  getToken(cookieName: string): Observable<PublicUser> {
    return this.http.get<PublicUser>(this.myAppUrl + this.myApiUrl + 'get/' + cookieName, {
      withCredentials: true // Esto permite que las cookies se envíen y se reciban
    });
  }
}
