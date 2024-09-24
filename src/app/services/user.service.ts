import { inject, Injectable } from '@angular/core';
import { User } from '../models/User';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PublicUser } from '../models/PublicUser';
import { CookieService } from './cookie.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private myAppUrl: string;
  private myApiUrl: string;
  user: PublicUser = new PublicUser('','','','',false);
  cookieService = inject(CookieService);
  constructor(private http: HttpClient) { 
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'api/Users/'
  }
  async getUserLogged(){
    (await this.cookieService.getUser()).subscribe(data => {
      this.user = data;
    });
    return this.user;
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
  async loginEmail(email: string){
    let userAux = await this.getUserEmailTC(email);
    if(userAux){
      return userAux;
    }else{
      return null;
    }
  }
  async readUser(id: string){
    let userAux = await this.getUserTC(id);
    let user = new User('','','','','', '');
    if(userAux){
      user = userAux;
    }
    return user;
  }
  async readUserByName(name: string){
    let userAux = await this.getUserNameTC(name);
    let user = new User('','','','','', '');
    if(userAux){
      user = userAux;
    }
    return user;
  }
  async getUserTC(id: string){
    try {
      const data = await this.getUser(id).toPromise();
      return data;
    } catch (error) {
      console.error('Error obteniendo datos:', error);
      throw error; // Puedes manejar el error de acuerdo a tus necesidades
    }
  }
  async getUserEmailTC(email: string){
    try {
      await this.getUserLogged();
      const data = await this.getUserByEmail(email).toPromise();
      return data;
    } catch (error) {
      console.error('Error obteniendo datos:', error);
      throw error; // Puedes manejar el error de acuerdo a tus necesidades
    }
  }
  async getUserNameTC(username: string){
    try {
      const data = await this.getUserByName(username).toPromise();
      return data;
    } catch (error) {
      console.error('Error obteniendo datos:', error);
      throw error; // Puedes manejar el error de acuerdo a tus necesidades
    }
  }
  async readAllUsers(){
    let usersAux = await this.getUsersTC();
    if(usersAux){
      return usersAux;
    }else{
      return null;
    }
  }
  async getUsersTC(){
    try {
      const data = await this.getUsers().toPromise();
      return data;
    } catch (error) {
      console.error('Error obteniendo datos:', error);
      throw error; // Puedes manejar el error de acuerdo a tus necesidades
    }
  }
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.myAppUrl + this.myApiUrl + 'nul', {
      withCredentials: true // Esto es necesario para enviar las cookies
    });  }
  getUser(id: string): Observable<User> {
    return this.http.get<User>(this.myAppUrl + this.myApiUrl + id); 
  }
  getUserByEmail(email: string): Observable<User> {
    let urlAux = this.myAppUrl + this.myApiUrl + "email/";
    if(this.user.email == ''){
      this.user.email = 'null';
    }
    return this.http.get<User>(urlAux + email + '/' + this.user.email);
  }
  async readLogin(email: string, password: string){
    let userAux = await this.loginTC(email, password);
    if(userAux != null){
      localStorage.setItem("userLogged", JSON.stringify(userAux));  //Se guarda en local storage una copia del usuario que se loguea, para saber que está logueado en cualquier parte de la pagina
      if(userAux.email == "nahuelarielmoron1@gmail.com"){
        localStorage.setItem("admin", JSON.stringify(true)); //Se guarda en local storage una comprobacion de admin, para saber en cualquier parte de la pagina que el usuario logueado es admin
      }
      return true;
    }else{
      return false;
    }
  }
  async loginTC(email: string, password: string){    
    try{
      let userAux = await this.login(email, password).toPromise();
    if(userAux){
      return userAux;
    }else{
      return null;
    }
    }catch(error){
      console.log(error);
      return null;
    }
  }

  async readTempLogin(email: string, password: string){
    let userAux = await this.tempLoginTC(email, password);
    if(userAux){
      return userAux;
    }else{
      return null;
    }
  }

  async tempLoginTC(email: string, password: string){    
    try{
      let userAux = await this.tempLogin(email, password).toPromise();
    if(userAux){
      return userAux;
    }else{
      return null;
    }
    }catch(error){
      console.log(error);
      return null;
    }
  }
  getUserByName(username: string): Observable<User> {
    let urlAux = this.myAppUrl + this.myApiUrl + "/username/";
    return this.http.get<User>(urlAux + username);
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
  tempLogin(email: string, password: string): Observable<User>{
    const user = {
      email,
      password
    }
    return this.http.post<User>(this.myAppUrl + this.myApiUrl + 'tempLogin', user);
  }
  login(email: string, password: string): Observable<User>{
    const userdata = {
      email,
      password
    }
    const urlAux = this.myAppUrl + this.myApiUrl + 'login/';
    
    return this.http.post<User>(urlAux, userdata, {
      withCredentials: true // Esto permite que las cookies se envíen y se reciban
    });  
  }

  logout(): Observable<void>{
    const urlAux = this.myAppUrl + this.myApiUrl + 'logout';
    return this.http.post<void>(urlAux, {
      withCredentials: true // Esto permite que las cookies se envíen y se reciban
    });  
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
