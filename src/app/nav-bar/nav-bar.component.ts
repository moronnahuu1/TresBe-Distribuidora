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
  elementsVisible: boolean = true;
  async ngOnInit() {
    this.logged = await this.isLogged();
    setTimeout(() => {
      this.elementsVisible = true;  // Esto aplicará la clase `show`
    }, 200);
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
  (await this.cookieService.tokenExistTC('access_token')).subscribe(data => {
    this.logged = data;
  });
  return this.logged;
 }
 async logout(){
  try{
    await this.userService.logoutTC();
    window.location.href = '';
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
