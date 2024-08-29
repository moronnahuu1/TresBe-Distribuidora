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
    let userdata: User = new User('', '', '', '', '');
    if(userAux){
       userdata = JSON.parse(userAux);
    }
    return userdata;
  }
  async readUserEmail(email: string){
    let userAux = await this.getUserEmailTC(email);
    if(userAux){
      if(userAux.email == email){
        
        let to = userAux.email;
        let subject = 'RECUPERACIÓN DE CONTRASEÑA'
        let html = `<div style="display: flex; align-items: center; width: 100%; background-color: rgb(239, 239, 239);">
    <div style="font-family: sans-serif; border: 2px solid orange; padding: 1vi; height: fit-content; width: 35vi; background-color: white;">
        <div style="display: flex; flex-direction: column align-items: center;">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8NCmCrXwgexWDbhCLBeyLUpFBi4FxQA9Zhw&s" style="margin-left: 20%; margin-right: 20%;" alt="">
        </div>
        <h1 style="color: rgb(0, 125, 221); text-align: center;">RECUPERAMOS TU CONTRASEÑA</h1>
        <p>Email: ${userAux.email}</p>
        <p>Contraseña: ${userAux.password}</p>
    </div>
</div>`;
        await this.sendEmail(to, subject, html).toPromise();
        return true;
      }else{
        return false;
      }
    }else{
      return false;
    }
  }
  async getUserEmailTC(email: string){
    try {
      const data = await this.getUserByEmail(email).toPromise();
      console.log(data);
      return data;
    } catch (error) {
      console.error('Error obteniendo datos:', error);
      throw error; // Puedes manejar el error de acuerdo a tus necesidades
    }
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
  sendEmail(to: string, subject: string, text: string): Observable<void>{
    const emailData = {
      to: to,
      subject: subject,
      text: text,
    };
    return this.http.post<void>(`${this.myAppUrl}${this.myApiUrl}` + 'email', emailData);
  }
  updateUser(id: string, productAux: User): Observable<void>{
    return this.http.patch<void>(`${this.myAppUrl}${this.myApiUrl}${id}`, productAux);
  }
}
