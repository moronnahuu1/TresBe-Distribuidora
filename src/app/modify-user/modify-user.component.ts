import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../models/User';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-modify-user',
  templateUrl: './modify-user.component.html',
  styleUrls: ['./modify-user.component.css']
})
export class ModifyUserComponent implements OnInit{
  priceArray: string[] = ['G','E','1','2','3','4'];
  userService = inject(UserService);
  activeRoute = inject(ActivatedRoute);
  id = this.activeRoute.snapshot.params['id'];
  userLogged: User = new User('','','','','');
  priceListNumber: string = '';
  toModify: boolean = false;
  viewPass: boolean = false;

  async ngOnInit() {
      this.userLogged = await this.userService.readUser(this.id);
      this.priceListNumber = this.userLogged.priceList;
  }

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
    let client = this.getString('clientInp');

    let userNew = new User(this.userLogged.id, email, pass, username, priceList);
    if(client == 'si'){
      userNew.client = true;
    }else{
      userNew.client = false;
    }
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
