import { Component, OnInit, inject } from '@angular/core';
import { OrdersService } from '../services/orders.service';
import { ActivatedRoute } from '@angular/router';
import { Order } from '../models/Order';

@Component({
  selector: 'app-has-order',
  templateUrl: './has-order.component.html',
  styleUrls: ['./has-order.component.css']
})
export class HasOrderComponent implements OnInit{
  orderService = inject(OrdersService);
    order: Order = new Order("", "", 0, 0, 0, 0, new Date(), "", "");
    activeRoute = inject(ActivatedRoute); //Ruta actual de la pagina
    id = this.activeRoute.snapshot.params['id']; //Se lee el parametro de la ruta actual, en este caso 'id'
    async ngOnInit() {
      try {
        const data = await this.orderService.getOrder(this.id).toPromise(); //Se busca la orden en la base de datos por el ID
        if(data != undefined){ //Se verifica que la orden exista
            console.log(data.code);
        }else{ //Si la orden no existe se redirecciona a la pagina principal, funciona como GUARD
            window.location.href = '';
        }
      } catch (error) {
        console.error('Error obteniendo datos:', error);
        window.location.href = '';
        throw error; // Puedes manejar el error de acuerdo a tus necesidades
      }
    }
}
