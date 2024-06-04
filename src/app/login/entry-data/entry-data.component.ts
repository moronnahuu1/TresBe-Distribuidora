import { Component, Inject, OnInit, inject } from '@angular/core';
import { User } from 'src/app/models/User';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-entry-data',
  templateUrl: './entry-data.component.html',
  styleUrls: ['./entry-data.component.css']
})
export class EntryDataComponent implements OnInit{
  userService = inject(UserService);
  users: Array<User> = [];
  async ngOnInit(): Promise<void> {
      await this.readUsers();
  }
  async readUsers(): Promise<void> {
    const usersAux = await this.getUsers();
    if(usersAux != undefined){
      for(let i=0; i<usersAux.length; i++){
        this.users.push(usersAux[i]);
      }
    }
}
async getUsers(): Promise<User[] | undefined>{
  try {
    const data = await this.userService.getUsers().toPromise();
    console.log(data?.length);
    return data;
  } catch (error) {
    console.error('Error obteniendo datos:', error);
    throw error; // Puedes manejar el error de acuerdo a tus necesidades
  }
}
validateUser(){
  let emailInp = document.getElementById("emailInp") as HTMLInputElement;
  let passwordInp = document.getElementById("passwordInp") as HTMLInputElement;
  let email = '';
  let password = '';
  if(emailInp && passwordInp){
    email = emailInp.value;
    password = passwordInp.value;
    let userIndex = this.checkCredentials(email, password);
    if(userIndex == -1){
    }else{
      localStorage.setItem("userLogged", JSON.stringify(this.users[userIndex]));
      if(this.users[userIndex].email == "nahuelarielmoron1@gmail.com"){
        localStorage.setItem("admin", JSON.stringify(true));
      }
      window.location.href = '';
    }
  }
}
checkCredentials(email: string, password: string){
  let i = 0;
  let access = false;
  while(i<this.users.length && !access){
    if(this.users[i].email == email){
      if(this.users[i].password == password){
        access = true;
      }else{
        i++;
      }
    }else{
      i++;
    }
  }
  if(access){
    return i;
  }else{
    return -1;
  }
}
}
