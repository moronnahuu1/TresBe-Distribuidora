import { Order } from "./Order";
import { OrderXproducts } from "./OrderXproduct";
import { Product } from "./Product";

export class OrdersAndProducts{
    order: Order;
    products: Product[] = [];
    constructor(order: Order, products: Product[]){
        this.order = order;
        this.products = products;
    }
}