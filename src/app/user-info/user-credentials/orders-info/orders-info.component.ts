import { Component, OnInit, inject } from '@angular/core';
import { Order } from 'src/app/models/Order';
import { OrderXproducts } from 'src/app/models/OrderXproduct';
import { OrdersAndProducts } from 'src/app/models/OrdersAndProducts';
import { Product } from 'src/app/models/Product';
import { OrderXProductsXOxpService } from 'src/app/services/order-x-products-x-oxp.service';
import { OrdersXProductsService } from 'src/app/services/orders-x-products.service';
import { OrdersService } from 'src/app/services/orders.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-orders-info',
  templateUrl: './orders-info.component.html',
  styleUrls: ['./orders-info.component.css']
})
export class OrdersInfoComponent implements OnInit{
  orderService = inject(OrdersService);
  orders: Order[] = [];
  orderxproductsxoxpService = inject(OrderXProductsXOxpService);
  ordersAndProducts: OrdersAndProducts[] = [];
  oxpHtml: OrdersAndProducts[] = [];
  
  async ngOnInit() {
      (await this.orderxproductsxoxpService.getProducts()).subscribe(products => {
        this.ordersAndProducts = products;
      })
      this.limitOxp();
  }
  limitOxp(){
    for(let i=0; i<3; i++){
      this.oxpHtml.push(this.ordersAndProducts[i]);
    }
  }

  getDates(orderDate: Date){
    let day = orderDate.getDate();
    let month = orderDate.getMonth();
    let year = orderDate.getFullYear();

    return day + month + year;
  }
}
