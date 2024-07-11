import { Component, OnInit, inject } from '@angular/core';
import { Order } from 'src/app/models/Order';
import { OrdersAndProducts } from 'src/app/models/OrdersAndProducts';
import { Product } from 'src/app/models/Product';
import { Userdata } from 'src/app/models/Userdata';
import { OrderXProductsXOxpService } from 'src/app/services/order-x-products-x-oxp.service';
import { UserdataService } from 'src/app/services/userdata.service';

@Component({
  selector: 'app-my-boughts',
  templateUrl: './my-boughts.component.html',
  styleUrls: ['./my-boughts.component.css']
})
export class MyBoughtsComponent implements OnInit{
  ordersAndProductsService = inject(OrderXProductsXOxpService);
  selectedOrder: Order = new Order('','',0,0,0,0,new Date(),'', '');
  selectedOXP: OrdersAndProducts = new OrdersAndProducts(this.selectedOrder, []);
  selectedProducts: Product[] = [];
  userdata: Userdata = new Userdata('','','','','','','','','','',0,'','');
  userdataService = inject(UserdataService);
  async ngOnInit() {
    this.ordersAndProductsService.selectedDefault().subscribe(oxpSelected => {
      this.selectedOXP = oxpSelected;
      this.selectedOrder = this.selectedOXP.order;
      this.selectedProducts = this.selectedOXP.products;
    });
    (await this.userdataService.returnUserID(this.selectedOrder.userdataId)).subscribe(userdata => {
      this.userdata = userdata;
    })
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

  isAdmin(){
    if(localStorage.getItem('admin')){
      return true;
    }else{
      return false;
    }
  }
}
