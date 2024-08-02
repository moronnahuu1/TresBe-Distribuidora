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
  areNavItemsVisible: boolean = true;
  isHidden: boolean = false;
  isTransitioning: boolean = false;
  ngOnInit(): void {
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
 isLogged(){
  /* Se comprueba con esta funcion si el usuario esta logueado o no, para modificar la barra segun el caso */
  let userAux = localStorage.getItem("userLogged"); //Se lee el usuario de copia cargado en local storage cuando se loguean
  if(userAux){ //Si el usuario existe entra aca y devuelve verdadero
    return true;
  }else{ //Si el usuario NO existe entra aca y devuelve falso
    return false;
  }
 }
 logout(){
  /* Al apretar el boton de logout se llama a esta funcion para desloguear al usuario */
  localStorage.removeItem("userLogged"); //Se remueve la copia del usuario de local storage
  if(localStorage.getItem("admin")){ //Se comprueba si el usuario que estaba logueado tenia permisos de administrador
    localStorage.removeItem("admin"); //Si los tiene, entrará aca y va a eliminar la caracteristica de administrador
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
