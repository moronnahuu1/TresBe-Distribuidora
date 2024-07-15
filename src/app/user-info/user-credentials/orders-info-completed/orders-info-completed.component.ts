import { Component, inject } from '@angular/core';
import { OrdersAndProducts } from 'src/app/models/OrdersAndProducts';
import { User } from 'src/app/models/User';
import { OrderXProductsXOxpService } from 'src/app/services/order-x-products-x-oxp.service';
import { OrdersService } from 'src/app/services/orders.service';
import { UserDisplayService } from 'src/app/services/user-display.service';

@Component({
  selector: 'app-orders-info-completed',
  templateUrl: './orders-info-completed.component.html',
  styleUrls: ['./orders-info-completed.component.css']
})
export class OrdersInfoCompletedComponent {
  orderxproductsxoxpService = inject(OrderXProductsXOxpService);
  ordersAndProducts: OrdersAndProducts[] = [];
  displayService = inject(UserDisplayService);
  orderService = inject(OrdersService);
  user: User = new User('','','','',0);
  
  async ngOnInit() {
     this.orderxproductsxoxpService.getOap().subscribe(products => {
      this.ordersAndProducts = products;
     });
     this.orderService.returnUser().subscribe(user => {
      this.user = user;
     });
  }
  changeDisplay(name: string, orderID: string){
    this.orderxproductsxoxpService.selectOrder(orderID);
    this.displayService.changeDisplay(name);
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
