import { Component, inject } from '@angular/core';
import { CartProduct } from 'src/app/models/CartProduct';
import { Order } from 'src/app/models/Order';
import { OrdersAndProducts } from 'src/app/models/OrdersAndProducts';
import { User } from 'src/app/models/User';
import { CartProductService } from 'src/app/services/cart-product.service';
import { OrderXProductsXOxpService } from 'src/app/services/order-x-products-x-oxp.service';
import { OrdersService } from 'src/app/services/orders.service';
import { UserDisplayService } from 'src/app/services/user-display.service';

@Component({
  selector: 'app-orders-info-completed',
  templateUrl: './orders-info-completed.component.html',
  styleUrls: ['./orders-info-completed.component.css']
})
export class OrdersInfoCompletedComponent {
  ordersAndProducts: OrdersAndProducts[] = [];
  oxpService = inject(OrderXProductsXOxpService);
  displayService = inject(UserDisplayService);
  orderService = inject(OrdersService);
  cartProductService = inject(CartProductService);
  cartProducts: CartProduct[] = [];
  orders: Order[] = [];
  user: User = new User('','','','','');
  
  async ngOnInit() {
     this.oxpService.getOap().subscribe(products => {
      this.ordersAndProducts = products;
     })
     this.orderService.returnUser().subscribe(user => {
      this.user = user;
     });
     
  }
  changeDisplay(name: string, orderID: string){
    this.oxpService.selectOrder(orderID);
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
getInput(name: string){
  if(name != undefined && name != ''){
    let inpAux = document.getElementById(name) as HTMLInputElement;
    if(inpAux){
      let input = inpAux.value;
      return input;
    }else{
      return '';
    }
  }else{
    return '';
  }
}
async searchOrder(){
  let input = this.getInput('searchInp');
  (await this.oxpService.getProducts('search', input)).subscribe(orders => {
    this.ordersAndProducts = orders;
  });
  ///this.orderService.searchOrder(input);
}
}
