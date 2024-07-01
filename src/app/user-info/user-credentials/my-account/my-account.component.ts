import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/User';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.css']
})
export class MyAccountComponent implements OnInit{
  user: User = new User('','','','',0);
  ngOnInit(): void {
      this.user = this.getUser();
  }
  getUser(){
    let userInfo: User = new User('','','','',0);
    let userAux = localStorage.getItem('userLogged');
    if(userAux){
      userInfo = JSON.parse(userAux);
    }
    return userInfo;
  }
}
