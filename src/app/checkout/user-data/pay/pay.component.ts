import { Component, inject } from '@angular/core';
import { Product } from 'src/app/models/Product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';
import { Order } from 'src/app/models/Order';
import { OrdersService } from 'src/app/services/orders.service';
import { OrderXproducts } from 'src/app/models/OrderXproduct';
import { OrdersXProductsService } from 'src/app/services/orders-x-products.service';
import { Router } from '@angular/router';
import { User } from 'src/app/models/User';
import { Userdata } from 'src/app/models/Userdata';
import { UserdataService } from 'src/app/services/userdata.service';
import { UserXcouponService } from 'src/app/services/user-xcoupon.service';
import { UserXcoupon } from 'src/app/models/UserXcoupon';

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
  userXcouponService = inject(UserXcouponService);
  oxpService = inject(OrdersXProductsService);
  userdata: Userdata = new Userdata('','','','','','','','','','',0,'','');
  userdataService = inject(UserdataService);
  cartProducts: Array<Product> = [];
  ///products: Array<Product> = [];
  subtotal: number = 0;
  total: number = 0;
  dataCreated: boolean = false;
  user: User = new User("", "", "", "",'', '');
  creating: boolean = false;
  coupon: string = '';

  async ngOnInit() {
    this.getUser();
    this.cartService.getProducts().subscribe(products => {
      this.cartProducts = products;
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

    this.coupon = this.getCouponID();

  }
  getCouponID(){
    let idAux = localStorage.getItem('coupon');
    let couponID = '';
    if(idAux){
      couponID = idAux;
    }
    localStorage.removeItem('coupon');
    return couponID;
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
        this.updateProducts(this.cartProducts[i].latestID, this.cartProducts[i]); //Se actualiza el producto en la base de datos
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
    let order: Order = new Order(orderID, this.generateRandomCode(), 0, 0, this.subtotal, this.total, new Date(), this.user.id, this.userdata.id, false, this.user.username); //Se crea la orden con los datos de la reserva
    let to = this.user.email;
    let subject = 'Orden de compra'
    let text = `<div style="display: flex; align-items: center; background-color: rgb(239, 239, 239); width: 50%; padding-left 50%; padding-right: 50%; padding-top: 10%; padding-bottom: 10%">
    <div style="font-family: sans-serif; border: 2px solid orange; padding: 1vi; height: fit-content; background-color: rgb(239, 239, 239);">
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8NCmCrXwgexWDbhCLBeyLUpFBi4FxQA9Zhw&s" style="margin-left: 38%;" alt="">
        <h1 style="color: rgb(0, 125, 221); text-align: center;">Gracias por comprar en Tresbe Distribuidora</h1>
        <h3 style="text-align: center; color: black;">Su orden se registró correctamente</h3>
        <h4 color: black;>DETALLE DE LA ORDEN</h4>
        <p color: black;>Código: #${order.code}</p>
        <p color: black;>Envío a: ${this.userdata.street} ${this.userdata.streetNumb}, ${this.userdata.city}, ${this.userdata.province}, ${this.userdata.country}</p>
        <p color: black;>Fecha: ${order.orderDate}</p>
        <p color: black;>Total: $${order.total.toLocaleString()}</p>
    </div>
</div>`;

    let textAux = `<div style="display: flex; align-items: center; width: 100%; background-color: rgb(239, 239, 239);">
    <div style="font-family: sans-serif; border: 2px solid orange; padding: 1vi; height: fit-content; width: 35vi; background-color: white;">
        <div style="display: flex; flex-direction: column align-items: center;">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8NCmCrXwgexWDbhCLBeyLUpFBi4FxQA9Zhw&s" style="margin-left: 20%; margin-right: 20%;" alt="">
        </div>
        <h1 style="color: rgb(0, 125, 221); text-align: center;">Tenes un nuevo pedido</h1>
        <p>Detalle De La Orden:</p>
        <p>Usuario: ${this.user.username}</p>
        <p>Código: #${order.code}</p>
        <p>Envío a: ${this.userdata.street} ${this.userdata.streetNumb}, ${this.userdata.city}, ${this.userdata.province}, ${this.userdata.country}</p>
        <p>Fecha: ${order.orderDate}</p>
        <p>Total: $${order.total.toLocaleString()}</p>
    </div>
</div>;`
    this.creating = true;
    await this.orderService.saveOrder(order, to, subject, text, textAux).toPromise(); //Se guarda la orden creada en la base de datos
    for(let i=0; i<this.cartProducts.length; i++){ //Se recorre el arreglo de productos DEL CARRITO
      let oxpAux: OrderXproducts = new OrderXproducts(this.generateRandomId(), orderID, this.cartProducts[i].id, this.cartProducts[i].quantity); //Se agregan los productos a una tabla de la base de datos (SOLO EL ID DEL PRODUCTO) y se lo relaciona con la orden de la misma manera (SOLO EL ID DE LA ORDEN)
      this.oxpService.saveOrderXproducts(oxpAux).subscribe(() => {}); //Se guardan los datos creados en la base de datos
      await this.addSellProduct(this.cartProducts[i]);
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
        if(this.coupon != ''){
          const userXcoupon = new UserXcoupon(this.generateRandomId(16), this.user.id, this.coupon);
          await this.userXcouponService.saveUser(userXcoupon).toPromise();
        }
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
  async addSellProduct(productAux: Product){
    /* La funcion se encarga de sumar una nueva venta al producto que se compra */
    let productReturned = await this.productService.returnOneProduct(productAux.latestID);
    if(productReturned){
      productReturned.sells = (productReturned.sells + 1);
      await this.updateProducts(productReturned.id, productReturned);
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
