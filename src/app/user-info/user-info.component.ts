import { Component, inject, OnInit } from '@angular/core';
import { OrdersAndProducts } from '../models/OrdersAndProducts';
import { OrderXProductsXOxpService } from '../services/order-x-products-x-oxp.service';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css']
})
export class UserInfoComponent implements OnInit{
  orderxproductsxoxpService = inject(OrderXProductsXOxpService);
  ordersAndProducts: OrdersAndProducts[] = [];
  async ngOnInit() {
    window.scrollTo(0, 0);
    (await this.orderxproductsxoxpService.getProducts()).subscribe(products => {
      this.ordersAndProducts = products;
    })
  }
}
