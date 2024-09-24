import { Component, inject, OnInit } from '@angular/core';
import { Product } from '../models/Product';
import { CartService } from '../services/cart.service';
import { CookieService } from '../services/cookie.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit{
  cartService = inject(CartService);
  products: Array<Product> = [];
  areNavItemsVisible: boolean = true;
  isHidden: boolean = false;
  isTransitioning: boolean = false;
  cookieService = inject(CookieService);
  logged: boolean = false;
  userService = inject(UserService);
  async ngOnInit() {
    this.logged = await this.isLogged();
    
    this.isTransitioning = true;
    this.areNavItemsVisible = !this.areNavItemsVisible;
    if (this.areNavItemsVisible) {
      // Show items with transition
      this.isHidden = false;
      setTimeout(() => {
        this.isTransitioning = false;
      }, 500); // This duration should match your CSS transition duration
    } else {
      // Hide items with transition
      setTimeout(() => {
        this.isHidden = true;
        this.isTransitioning = false;
      }, 500); // This duration should match your CSS transition duration
    }
    this.cartService.getProducts().subscribe(products => { //Se leen los productos del carrito para poner la cantidad de productos en la barra
      this.products = products;
    })
}
 async isLogged(){
  let logged: boolean = false;
  logged = await this.cookieService.tokenExistTC('access_token');
  return logged;
 }
 async logout(){
  try{
    await this.userService.logoutTC();
  }catch(error){
    console.log("Hubo un error!");
  }
 }
 toggleNav(): void {
  this.isTransitioning = true;
  if (this.isHidden) {
    // Mostrar elementos con transición
    this.isHidden = false;
    this.isTransitioning = false;
  } else {
    // Ocultar elementos con transición
      this.isHidden = true;
      this.isTransitioning = false;
  }
}
}
