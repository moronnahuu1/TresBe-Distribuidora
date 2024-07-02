import { Component, OnInit, inject } from '@angular/core';
import { User } from 'src/app/models/User';
import { Userdata } from 'src/app/models/Userdata';
import { UserDisplayService } from 'src/app/services/user-display.service';
import { UserdataService } from 'src/app/services/userdata.service';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.css']
})
export class MyAccountComponent implements OnInit{
  displayService = inject(UserDisplayService);
  userdataService = inject(UserdataService);
  displayed = this.displayService.displayed;
  user: User = new User('','','','',0);
  userdata: Userdata = new Userdata('','','','','','','','','','',0,'','');

  async ngOnInit() {
      this.user = this.getUser();
      const usersAux = await this.getUserData();
      if(usersAux != undefined){
        this.userdata = usersAux;
      }
  }

  changeDisplay(name: string){
    this.displayService.changeDisplay(name);
  }

  getUser(){
    let userAux = localStorage.getItem('userLogged');
    let userParsed: User = new User('','','','',0);
    if(userAux){
      userParsed = JSON.parse(userAux);
    }
    return userParsed;
  }

  async getUserData(){
    /* La funcion se conecta con el servicio de userdata para leer la base de datos de la informacion del envio para los usuarios */
    try {
      const data = await this.userdataService.getUserdataByUserID(this.user.id).toPromise();
      console.log(data);
      return data;
    } catch (error) {
      console.error('Error obteniendo datos:', error);
      throw error; // Puedes manejar el error de acuerdo a tus necesidades
    }
  }
}
