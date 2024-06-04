import { Component, inject } from '@angular/core';
import { Product } from '../models/Product';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent {
  cartService = inject(CartService);
  products: Array<Product> = [];
  ngOnInit(): void {
    this.cartService.getProducts().subscribe(products => {
      this.products = products;
    })
}
 isLogged(){
  let userAux = localStorage.getItem("userLogged");
  if(userAux){
    return true;
  }else{
    return false;
  }
 }
 logout(){
  localStorage.removeItem("userLogged");
  if(localStorage.getItem("admin")){
    localStorage.removeItem("admin");
  }
 }
}
