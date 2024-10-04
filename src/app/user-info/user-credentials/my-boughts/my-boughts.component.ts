import { Component, OnInit, inject } from '@angular/core';
import { adminGuard } from 'src/app/guards/admin.guard';
import { CartProduct } from 'src/app/models/CartProduct';
import { Order } from 'src/app/models/Order';
import { OrdersAndProducts } from 'src/app/models/OrdersAndProducts';
import { PublicUser } from 'src/app/models/PublicUser';
import { User } from 'src/app/models/User';
import { Userdata } from 'src/app/models/Userdata';
import { CookieService } from 'src/app/services/cookie.service';
import { EmailService } from 'src/app/services/email.service';
import { OrderXProductsXOxpService } from 'src/app/services/order-x-products-x-oxp.service';
import { OrdersService } from 'src/app/services/orders.service';
import { UserService } from 'src/app/services/user.service';
import { UserdataService } from 'src/app/services/userdata.service';
import Swal from 'sweetalert2/dist/sweetalert2.js'

@Component({
  selector: 'app-my-boughts',
  templateUrl: './my-boughts.component.html',
  styleUrls: ['./my-boughts.component.css']
})
export class MyBoughtsComponent implements OnInit{
  ordersAndProductsService = inject(OrderXProductsXOxpService);
  selectedOrder: Order = new Order('','',0,0,0,0,new Date(),'', '', false, '');
  selectedOXP: OrdersAndProducts = new OrdersAndProducts(this.selectedOrder, []);
  selectedProducts: CartProduct[] = [];
  userdata: Userdata = new Userdata('','','','','','','','','','',0,'','');
  userdataService = inject(UserdataService);
  orderService = inject(OrdersService);
  user: PublicUser = new PublicUser('','','','',false);
  admin: boolean = false;
  emailService = inject(EmailService);
  userService = inject(UserService);
  userOrder: string = '';
  cookieService = inject(CookieService);
  async ngOnInit() {

    (await this.cookieService.getUser()).subscribe(data => {
      this.user = data;
    });
    (await this.cookieService.tokenExistTC('admin_token')).subscribe(data => {
      this.admin = data;
    });
    this.ordersAndProductsService.selectedDefault().subscribe(oxpSelected => {
      this.selectedOXP = oxpSelected;
      this.selectedOrder = this.selectedOXP.order;
      this.selectedProducts = this.selectedOXP.products;
    });
    (await this.userdataService.returnUserID(this.selectedOrder.userdataId)).subscribe(userdata => {
      this.userdata = userdata;
    });
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

async getOrderUser(userID: string){
  try{
    let userAux = await this.userService.getUser(userID).toPromise();
    if(userAux){
      this.userOrder = userAux.email;
    }
  }catch(error){
    console.log(error);
  }
}

  isAdmin(){
    if(this.admin){
      return true;
    }else{
      return false;
    }
  }
  async deleteUserOrder(orderID: string){
    let confirmation = confirm(`Esta seguro que desea borrar la orden #${orderID}?`);
    if(confirmation){
      await this.orderService.deleteOrder(this.selectedOrder.id).toPromise();
      alert('Orden de compra borrada exitosamente');
    }
  }
  confirmAttend(type: string){
    const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success",
      cancelButton: "btn btn-danger",
      title: "custom-title",
    },
    buttonsStyling: true
  });
  swalWithBootstrapButtons.fire({
    title: "Confirmas que la orden esta registrada en NUVIX?",
    text: "Si te equivocas, se puede revertir luego!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Si, registrar!",
    confirmButtonColor: 'rgb(0, 197, 0)',
    cancelButtonColor: 'red',
    cancelButtonText: "No, cancelar!",
    reverseButtons: true
  }).then(async (result) => {
    if (result.isConfirmed) {
      if(type == 'attend'){
        await this.attendOrder();
      }else if(type == 'unattend'){
        await this.unattendOrder();
      }
      swalWithBootstrapButtons.fire({
        title: "Registrada!",
        text: "La orden se ha registrado.",
        icon: "success"
      });
    } else if (
      /* Read more about handling dismissals below */
      result.dismiss === Swal.DismissReason.cancel
    ) {
      swalWithBootstrapButtons.fire({
        title: "Operación cancelada",
        text: "La orden queda sin registrar :)",
        icon: "error"
      });
    }
  });

  }
  async attendOrder(){
    ///let confirmation = confirm("Al dar click está confirmando que la orden ya fue registrada y cargada en NUVIX para luego ser preparada");
      this.selectedOrder.attended = true;
      await this.orderService.updateOrder(this.selectedOrder.id, this.selectedOrder).toPromise();
      await this.getOrderUser(this.selectedOrder.userID);
      let to = this.userOrder;
      let subject = 'Pedido Registrado'
      let html = `<div style="display: flex; align-items: center; width: 100%; background-color: rgb(239, 239, 239);">
    <div style="font-family: sans-serif; border: 2px solid orange; padding: 1vi; height: fit-content; width: 35vi; background-color: white;">
        <div style="display: flex; flex-direction: column; align-items: center">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8NCmCrXwgexWDbhCLBeyLUpFBi4FxQA9Zhw&s" style="margin-left: 20%; margin-right: 20%;" alt="">
        </div>
        <h1 style="color: rgb(0, 125, 221); text-align: center;">Tu compra ya fue registrada</h1>
        <p>Hola! queremos informarte que ya tomamos tu pedido, en breve estaremos despachando los productos!</p>
        <p>Usuario: ${this.selectedOrder.username}</p>
        <p>Código de orden: #${this.selectedOrder.code}</p>
        <p>Total: $${this.selectedOrder.total.toLocaleString()}</p>
    </div>
</div>`;
      await this.emailService.sendEmailTC(to, subject, html);
  }
  async unattendOrder(){
    let confirmation = confirm("Al dar click está confirmando que la orden aún no fue registrada y necesita verla en este apartado");
    if(confirmation){
      this.selectedOrder.attended = false;
      this.orderService.updateOrder(this.selectedOrder.id, this.selectedOrder).subscribe(()=>{});
    }
  }
  formatNumber(number: number): string { //Funcion de front, se usa en HTML para mostrar los numeros grandes de forma mas legible.
    return number.toLocaleString(); // Esto añadirá separadores de miles
  }
}
