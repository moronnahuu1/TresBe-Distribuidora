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
isHidden: boolean = true;
isTransitioning: boolean = false;
cookieService = inject(CookieService);
logged: boolean = false;
userService = inject(UserService);
elementsVisible: boolean = true;

async ngOnInit() {
  this.logged = await this.isLogged();

  // Detectar resolución de pantalla y establecer isHidden
  const isMobile = window.matchMedia("(max-width: 768px)").matches;
  this.isHidden = isMobile;  // Ocultar menú si es mobile, mostrar si es desktop

  // Leer los productos del carrito
  this.cartService.getProducts().subscribe((products) => {
    this.products = products;
  });

  // Escuchar cambios de resolución en tiempo real (opcional)
  window.matchMedia("(max-width: 768px)").addEventListener("change", (e) => {
    this.isHidden = e.matches;
  });
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
