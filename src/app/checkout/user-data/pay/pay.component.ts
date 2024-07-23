import { Component, inject } from '@angular/core';
import { Product } from 'src/app/models/Product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';
import { ShipmentComponent } from '../../shipment/shipment.component';
import { Order } from 'src/app/models/Order';
import { OrdersService } from 'src/app/services/orders.service';
import { OrderXproducts } from 'src/app/models/OrderXproduct';
import { OrdersXProductsService } from 'src/app/services/orders-x-products.service';
import { Router } from '@angular/router';
import { User } from 'src/app/models/User';
import { Userdata } from 'src/app/models/Userdata';
import { UserdataService } from 'src/app/services/userdata.service';

@Component({
  selector: 'app-pay',
  templateUrl: './pay.component.html',
  styleUrls: ['./pay.component.css']
})
export class PayComponent {
  router = inject(Router);
  cartService = inject(CartService);
  productService = inject(ProductService);
  orderService = inject(OrdersService);
  oxpService = inject(OrdersXProductsService);
  userdata: Userdata = new Userdata('','','','','','','','','','',0,'','');
  userdataService = inject(UserdataService);
  cartProducts: Array<Product> = [];
  products: Array<Product> = [];
  subtotal: number = 0;
  total: number = 0;
  dataCreated: boolean = false;
  user: User = new User("", "", "", "",0);

  async ngOnInit() {
    this.getUser();
    this.cartService.getProducts().subscribe(products => {
      this.cartProducts = products;
    })

    this.productService.getProducts().subscribe(products => {
      this.products = products;
    })

    this.cartService.getSubtotal().subscribe(subtotal => {
      this.subtotal = subtotal;
    })

    this.cartService.getTotal().subscribe(total => {
      this.total = total;
    });

    (await this.userdataService.returnUserdata(this.user.id)).subscribe(userdata => {
      this.userdata = userdata;
    });

  }

  getUser(){
    /* La funcion se encarga de comprobar que el usuario este logueado, de lo contrario, no se podra continuar con la operacion. */
    let userAux = localStorage.getItem("userLogged");
    if(userAux){
      this.user = JSON.parse(userAux);
    }
  }

  modifyStock(){
    for(let i=0; i<this.cartProducts.length; i++){ //Se recorre la lista de los productos UNICAMENTE en el CARRITO
      if(this.cartProducts[i].stock >= this.cartProducts[i].quantity){ //Se comprueba que el stock no sea menor a la cantidad pedida
        this.cartProducts[i].stock = this.cartProducts[i].stock - this.cartProducts[i].quantity; //Se actualiza el stock
        this.updateProducts(this.cartProducts[i].id, this.cartProducts[i]); //Se actualiza el producto en la base de datos
      }
    }
  }

  generateRandomId(length: number = 16): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}
  generateRandomCode(length: number = 5): string {
    const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    const charactersLength = characters.length;
    
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}
  async createOrder(){
    /* La funcion se encarga de manejar la base de datos creando la nueva orden del usuario y agregandola a la base de datos */
    let orderID = this.generateRandomId(); //Se crea un ID de la orden
    let order: Order = new Order(orderID, this.generateRandomCode(), 0, 0, this.subtotal, this.total, new Date(), this.user.id, this.userdata.id); //Se crea la orden con los datos de la reserva
    await this.orderService.saveOrder(order).toPromise(); //Se guarda la orden creada en la base de datos
    let emailData = {
      to: this.user.email,
      subject: 'Orden de compra',
      text: 'Gracias por comprar en Tresbe Distribuidora. Su orden se registro correctamente'
    };
    for(let i=0; i<this.cartProducts.length; i++){ //Se recorre el arreglo de productos DEL CARRITO
      let oxpAux: OrderXproducts = new OrderXproducts(this.generateRandomId(), orderID, this.cartProducts[i].id, this.cartProducts[i].quantity); //Se agregan los productos a una tabla de la base de datos (SOLO EL ID DEL PRODUCTO) y se lo relaciona con la orden de la misma manera (SOLO EL ID DE LA ORDEN)
      this.oxpService.saveOrderXproducts(oxpAux).subscribe(() => {}); //Se guardan los datos creados en la base de datos
    }
    return orderID; //Se retorna el ID de la orden creada
  }
  async verifyDebts(){
    try {
      const data = await this.orderService.getOrdersNotPayed().toPromise();
      console.log(data?.length);
      return data;
    } catch (error) {
      console.error('Error obteniendo datos:', error);
      throw error; // Puedes manejar el error de acuerdo a tus necesidades
    }
  }

  async getDebts(){
    let ordersAux = await this.verifyDebts();
    let totalDebt = 0;
    if(ordersAux){
      for(let i = 0; i<ordersAux.length; i++){
        totalDebt += ordersAux[i].total;
      }
    }
    return totalDebt;
  }
  noDebt(totalDebt: number){
    if(totalDebt < 50000000){
      let totalAmount = totalDebt + this.total;
      if(totalAmount < 50000000){
        return true;
      }else{
        return false;
      }
    }else{
      return false;
    }
  }

  async placeOrder(){
    /* La funcion es la principal del componente, cuando el usuario reserva la orden se llama a esta funcion, y la funcion se encarga
    de llamar a las demas funciones para realizar las acciones que correspondan */
    if(localStorage.getItem("dataCreated")){ //Verifica que el carrito tenga productos cargados
      ///this.modifyStock();
      let totalDebt = 0///await this.getDebts();
      if(this.noDebt(totalDebt)){
        let orderID = await this.createOrder();
        this.cartService.saveCartAfterOrder(orderID);
        this.router.navigate([`/checkout/${orderID}`]); //Se redirecciona a la ruta del componente 'placed' para informarle al usuario que su orden fue creada
      }else{
        this.router.navigate([`/checkout/amount/exceeded`])
      }
      
    }else{
      alert("Por favor, guarde los datos de envio antes de confirmar el pedido");
    }
  }
  async updateProducts(productID: string, productAux: Product): Promise<void>{
    /* La funcion se encarga de actualizar los productos de la base de datos */
    try {
      const data = await this.productService.updateProduct(productID, productAux).toPromise();
      console.log(data);
      return data;
    } catch (error) {
      console.error('Error obteniendo datos:', error);
      throw error; // Puedes manejar el error de acuerdo a tus necesidades
    }
  }
}
