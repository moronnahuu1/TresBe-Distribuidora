import { Component, inject, OnInit } from '@angular/core';
import { User } from 'src/app/models/User';
import { Userdata } from 'src/app/models/Userdata';
import { OrdersService } from 'src/app/services/orders.service';
import { UserDisplayService } from 'src/app/services/user-display.service';
import { UserdataService } from 'src/app/services/userdata.service';

@Component({
  selector: 'app-user-account',
  templateUrl: './user-account.component.html',
  styleUrls: ['./user-account.component.css']
})
export class UserAccountComponent implements OnInit{
  displayService = inject(UserDisplayService);
  userdataService = inject(UserdataService);
  displayed = this.displayService.displayed;
  user: User = new User('','','','',0);
  userdata: Userdata = new Userdata('','','','','','','','','','',0,'','');
  orderService = inject(OrdersService);

  async ngOnInit() {
      this.orderService.returnUser().subscribe(user => {
        this.user = user;
      });
      (await this.userdataService.returnUserdata(this.user.id)).subscribe(userdata => {
        this.userdata = userdata;
      });
  }

  changeDisplay(name: string){
    this.displayService.changeDisplay(name);
  }
  isAdmin(){
    if(localStorage.getItem('admin')){
      return true;
    }else{
      return false;
    }
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
