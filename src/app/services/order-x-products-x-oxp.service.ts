import { Injectable, inject } from '@angular/core';
import { OrderXproducts } from '../models/OrderXproduct';
import { OrdersAndProducts } from '../models/OrdersAndProducts';
import { Product } from '../models/Product';
import { OrdersXProductsService } from './orders-x-products.service';
import { OrdersService } from './orders.service';
import { ProductService } from './product.service';
import { Order } from '../models/Order';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderXProductsXOxpService {

  orderService = inject(OrdersService);
  orders: Order[] = [];
  oxps: OrderXproducts[] = [];
  orderAndproducts: OrdersAndProducts[] = [];
  _orderAndproducts: BehaviorSubject<OrdersAndProducts[]> = new BehaviorSubject<OrdersAndProducts[]>([]);
  productService = inject(ProductService);
  oxpService = inject(OrdersXProductsService);

  constructor() { }

  async getProducts(){
    (await this.orderService.readOrders()).subscribe(orders => {
      this.orders = orders;
    });
    
    for(let i=0; i<this.orders.length; i++){
      let productsArray: Product[] = [];
      (await this.oxpService.readOxp(this.orders[i].id)).subscribe(async oxps => {
        this.oxps = oxps;
        for(let j=0; j<oxps.length; j++){
          let productAux = await this.productService.getOneProduct(oxps[j].productId);
          if(productAux){
            let m=0;
            let access = false;
            while(m<productsArray.length && !access){
              if(productsArray[m].id == productAux.id){
                productsArray[m].quantity += 1;
                access = true;
              }else{
                m++;
              }
            }
            if(!access){
              productsArray.push(productAux);
            }
          }
        }
      });
      let orderandProduct: OrdersAndProducts = new OrdersAndProducts(this.orders[i], productsArray);
      this.orderAndproducts.push(orderandProduct);
      this._orderAndproducts.next(this.orderAndproducts);
    }
    return this._orderAndproducts.asObservable();
  }
}
