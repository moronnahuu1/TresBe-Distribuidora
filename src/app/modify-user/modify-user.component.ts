import { Component, inject } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../models/User';

@Component({
  selector: 'app-modify-user',
  templateUrl: './modify-user.component.html',
  styleUrls: ['./modify-user.component.css']
})
export class ModifyUserComponent {
  priceArray: string[] = ['G','E','1','2','3','4'];
  userService = inject(UserService);
  userLogged: User = this.userService.getUserLogged();
  priceListNumber: string = this.userLogged.priceList;
  toModify: boolean = false;
  viewPass: boolean = false;

  changeSelect(event: Event){
    let priceListAux = (event.target as HTMLSelectElement).value;
    this.priceListNumber = priceListAux;
  }

  changeViewPass(){
    let passInp = document.getElementById('passInp') as HTMLInputElement;
    if(passInp){
      if(passInp.type === 'password'){
        passInp.type = 'text';
        this.viewPass = true;
      }else if(passInp.type === 'text'){
        passInp.type = 'password';
        this.viewPass = false;
      }
    }
  }

  enable(){
    this.toModify = true;
  }

  async modifyUser(){
    let userAux = this.createNewUser();
    await this.userService.updateUser(this.userLogged.id, userAux).toPromise();
    this.toModify = false;
  }

  createNewUser(){
    let username = this.getString('usernameInp');
    let email = this.getString('emailInp');
    let pass = this.getString('passInp');
    let priceList = this.priceListNumber;

    let userNew = new User(this.userLogged.id, email, pass, username, priceList);
    return userNew;
  }

  getValue(type: string){
    switch(type){
      case 'username':
        return this.userLogged.username;
      case 'email':
        return this.userLogged.email;
      case 'password':
        return this.userLogged.password;
      case 'client':
        return this.userLogged.client;
      default:
        return '';
    }
  }

  getString(name: string): string{ //La funcion sirve para leer cada uno de los input del html, siempre y cuando sean string
    let divAux = document.getElementById(name) as HTMLInputElement;
    let miDiv = "";
    if(divAux != null && divAux != undefined){
      miDiv = divAux.value;
    }
    return miDiv;
  }
}
