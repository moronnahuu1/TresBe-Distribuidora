import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Order } from 'src/app/models/Order';
import { OrderXproducts } from 'src/app/models/OrderXproduct';
import { User } from 'src/app/models/User';
import { Userdata } from 'src/app/models/Userdata';
import { OrdersXProductsService } from 'src/app/services/orders-x-products.service';
import { OrdersService } from 'src/app/services/orders.service';
import { UserdataService } from 'src/app/services/userdata.service';

@Component({
  selector: 'app-buttons-detail',
  templateUrl: './buttons-detail.component.html',
  styleUrls: ['./buttons-detail.component.css']
})
export class ButtonsDetailComponent implements OnInit{
  userdataService = inject(UserdataService);
  orderService = inject(OrdersService);
  oxpService = inject(OrdersXProductsService);
  router = inject(Router);
  orderID: string = "";
  order: Order = new Order("","",0,0,0,0,new Date(),"", "", false, '');
  activeRoute = inject(ActivatedRoute);
  oxp: Array<OrderXproducts> = [];
  userdataArray: Array<Userdata> = [];
  user: User = new User("", "", "", "",'', '');
  userdata: Userdata = new Userdata("", "","","","","","","","","",0,"","");
  users: Array<Userdata> = [];

  async ngOnInit() {
    this.user = this.getUser();
    this.orderID = this.activeRoute.snapshot.params['id'];
    await this.readOXP();
    await this.readUserdata();
  }

  async readUserdata(): Promise<void> {
    const id = this.activeRoute.snapshot.params['id'];
    if(id){
      let UserdataAux = await this.getUserdata(this.user.id);
      if(UserdataAux != undefined){
        this.userdata = UserdataAux;
      }
    }
  }

  async getUserdata(userID: string): Promise<Userdata | undefined>{
    try {
      const data = await this.userdataService.getUserdataByUserID(userID).toPromise();
      return data;
    } catch (error) {
      console.error('Error obteniendo datos:', error);
      throw error;
    }
  }
  getUser(){
    let userAux = localStorage.getItem("userLogged");
    let userAux1 = new User("", "", "", "",'', '');
    if(userAux){
      userAux1 = JSON.parse(userAux);
    }
    return userAux1;
  }
  async cancelOrder(){
    const userConfirmed: boolean = window.confirm("Desea cancelar la orden?");
    if(userConfirmed){
      for(let i=0; i<this.oxp.length; i++){
        if(this.oxp[i].orderId == this.orderID){
          await this.deleteOXP(this.oxp[i].id);
        }
      }
      if(this.userdata.saveIt == "false"){
        await this.deleteUserdata();
      }
      await this.deleteOrder();
      this.router.navigate(['/']);
    }
  }

  async deleteOrder(){
      try {
        const data = await this.orderService.deleteOrder(this.orderID).toPromise();
        return data;
      } catch (error) {
        console.error('Error obteniendo datos:', error);
        throw error; // Puedes manejar el error de acuerdo a tus necesidades
      }
  }

  async deleteOXP(oxpID: string){
    try {
      const data = await this.oxpService.deleteOrderXproducts(oxpID).toPromise();
      return data;
    } catch (error) {
      console.error('Error obteniendo datos:', error);
      throw error; // Puedes manejar el error de acuerdo a tus necesidades
    }
  }

  async readOXP(): Promise<void> {
    const oxpAux = await this.getOrderXproducts();
    if(oxpAux != undefined){
      for(let i=0; i<oxpAux.length; i++){
        this.oxp.push(oxpAux[i]);
      }
    }
}

  async getOrderXproducts(){
    try {
      const data = await this.oxpService.getOrdersXproducts().toPromise();
      return data;
    } catch (error) {
      console.error('Error obteniendo datos:', error);
      throw error; // Puedes manejar el error de acuerdo a tus necesidades
    }
  }

  async deleteUserdata(){
    try {
      const data = await this.userdataService.deleteUserdata(this.userdata.id).toPromise();
      return data;
    } catch (error) {
      console.error('Error obteniendo datos:', error);
      throw error; // Puedes manejar el error de acuerdo a tus necesidades
    }
  }
  setLater(){
    localStorage.setItem('userOrders', JSON.stringify(true));
  }
}
