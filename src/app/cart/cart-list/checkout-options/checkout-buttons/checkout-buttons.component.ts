import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Order } from 'src/app/models/Order';
import { User } from 'src/app/models/User';
import { OrdersService } from 'src/app/services/orders.service';

@Component({
  selector: 'app-checkout-buttons',
  templateUrl: './checkout-buttons.component.html',
  styleUrls: ['./checkout-buttons.component.css']
})
export class CheckoutButtonsComponent {
  orderService = inject(OrdersService);
  router = inject(Router);
  user: User = new User('', '', '', '', 0);
  async verifyOrders(){
    this.user = this.getUser();
    /*let existanceID = await this.hasOrder();
    if(existanceID != ""){
      this.router.navigate([`/checkout/orderExist/${existanceID}`]);
    }else{
      this.router.navigate(['/checkout']);
    }*/
   this.router.navigate(['/checkout']);
  }
  getUser(){
    let userAux = localStorage.getItem('userLogged');
    let userdata: User = new User('', '', '', '', 0);
    if(userAux){
       userdata = JSON.parse(userAux);
    }
    return userdata;
  }
  //async hasOrder(){
    /* La funcion se encarga de comprobar que al momento de realizar el pedido no exista otra orden/pedido del usuario sin finalizar,
    si la orden existe va a devolver el ID de la orden, si no existe devolverá un texto vacio. Para verificar si existe o no alguna 
    orden, se lee la lista de ordenes de la base de datos y se guarda la orden en un arreglo (aunque solo deberia ser 1 orden) y se
    busca el id de la orden. */
    /*let id: string = "";
    const orders: Array<Order> = await this.readOrders();
    if(orders.length>0){
      id = orders[0].id;
    }
    return id;
  }*/
  async readOrders(){
    /* La funcion va a encargarse de esperar mediante un await a la funcion de getOrders, si esa funcion retorna correctamente los
    valores, deberia pasar la verificacion de si es distinto de undefined, y si entra, recorrerá el arreglo auxiliar que tiene los
    valores retornados y los agregará al arreglo de ordenes que luego se retornará. */
    const ordersAux = await this.getOrders();
    const orders: Array<Order> = [];
    if(ordersAux != undefined){
      for(let i=0; i<ordersAux.length; i++){
        orders.push(ordersAux[i]);
      }
    }
    return orders;
}
async getOrders(){
  /* La funcion se conecta directamente con la base de datos a traves del servicio orderService para leer las ordenes almacenadas. */
  try {
    const data = await this.orderService.getOrders().toPromise();
    console.log(data?.length);
    return data;
  } catch (error) {
    console.error('Error obteniendo datos:', error);
    throw error; // Se maneja el error de acuerdo a las necesidades que se requieran en el momento
  }
}
}
