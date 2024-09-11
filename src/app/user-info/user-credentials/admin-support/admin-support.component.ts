import { Component, inject } from '@angular/core';
import { OrdersAndProducts } from 'src/app/models/OrdersAndProducts';
import { User } from 'src/app/models/User';
import { OrderXProductsXOxpService } from 'src/app/services/order-x-products-x-oxp.service';
import { OrdersService } from 'src/app/services/orders.service';
import { UserService } from 'src/app/services/user.service';
import { UserdataService } from 'src/app/services/userdata.service';

@Component({
  selector: 'app-admin-support',
  templateUrl: './admin-support.component.html',
  styleUrls: ['./admin-support.component.css']
})
export class AdminSupportComponent{
  orderxproductsxoxpService = inject(OrderXProductsXOxpService);
  ordersAndProducts: OrdersAndProducts[] = [];
  orderService = inject(OrdersService);
  userService = inject(UserService);
  user: User = new User('','','','','');
  userdataService = inject(UserdataService);

  async searchUser(){
    let userID = this.getInput('userInp');
    if(userID != ''){
      this.user = await this.userService.readUserByName(userID);
      this.orderService.changeUser(this.user);
      (await this.orderxproductsxoxpService.getProducts('', null)).subscribe(products => {
        this.ordersAndProducts = products;
      });
      (await this.userdataService.returnUserdata(this.user.id)).subscribe(userdata => {
      }); ///LA INFO DE USUARIO SE ACTUAlIZA PARA VER LA INFO DEL USUARIO BUSCADO
    }
  }

  getInput(name: string){
    let miInp = document.getElementById(name) as HTMLInputElement;
    let inpValue = '';
    if(miInp){
      inpValue = miInp.value;
    }
    return inpValue;
  }

  async readUser(id: string){
    let userAux = await this.getUser(id);
    let userAux1: User = new User('','','','','');
    if(userAux){
      userAux1 = userAux;
    }
    return userAux1;
  }

  async getUser(id: string){
    try {
      const data = await this.userService.getUser(id).toPromise();
      console.log(data);
      return data;
    } catch (error) {
      console.error('Error obteniendo datos:', error);
      throw error; // Puedes manejar el error de acuerdo a tus necesidades
    }
  }

  getDates(orderDate: Date): string {
    let newDate = new Date(orderDate);
    if (!(newDate instanceof Date) || isNaN(newDate.getTime())) {
        throw new Error("Invalid date");
    }
    
    let day = newDate.getDate().toString().padStart(2, '0');
    let month = (newDate.getMonth() + 1).toString().padStart(2, '0');
    let year = newDate.getFullYear().toString();

    return `${day}/${month}/${year}`;
}
}
