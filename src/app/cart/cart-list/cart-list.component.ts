import { Component, inject } from '@angular/core';
import { Product } from 'src/app/models/Product';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart-list',
  templateUrl: './cart-list.component.html',
  styleUrls: ['./cart-list.component.css']
})
export class CartListComponent {
  cartService = inject(CartService);
  products: Array<Product> = [];

  ngOnInit(): void {
      this.cartService.getProducts().subscribe(products => {
        this.products = products;  ///Se lee la lista de productos que estan en el carrito y se inicializa en un array de productos
      })
      this.startQuantity(); 
  }
  deleteProduct(index: number){ ///Al apretar el boton X que se ve en el carrito borra el producto
    this.cartService.deleteProduct(index);
  }
  startQuantity(){ 
    /*Los productos por defecto cuando son cargados en el array de productos no tienen una cantidad asignada, 
    por lo que al cargarlos en el carrito(Si no tienen ya una cantidad asignada ya que pueden estar desde antes en el carrito) 
    se les asigna por defecto 1*/
    for(let i=0; i<this.products.length; i++){
      if(!this.products[i].quantity){
        this.products[i].quantity = 1;
      }
    }
  }
  incrementQuantity(product: Product, index: number){
    /* Cuando el usuario hace click en el boton +, se llama a esta funcion para que primero recorra la lista de productos, luego
    encuentre el producto y una vez que lo encuentra le cambia la cantidad, en este caso incrementando, pero realiza comprobaciones
    antes para no caer en fallos como por ejemplo revisar que la cantidad que el usuario desea no sea mayor a la del stock disponible */
    //if(product.quantity < product.stock){
      let i=0;
      let access = false;
      while(i<this.products.length && !access){
        if(this.products[i].id == product.id){
          access = true;
        }else{
          i++;
        }
      }
      if(access){
        this.products[i].quantity = this.products[i].quantity + 1;
        this.cartService.updateProduct(index, this.products[i]);
      }
    //}
  }

  decrementQuantity(product: Product, index: number){
 /* Cuando el usuario hace click en el boton -, se llama a esta funcion para que primero recorra la lista de productos, luego
    encuentre el producto y una vez que lo encuentra le cambia la cantidad, en este caso decrementando, pero realiza comprobaciones
    antes para no caer en fallos como por ejemplo revisar que la cantidad que el usuario desea no sea menor a 1 unidad, ya que podria
    caer en numeros menores a 0, lo que implicaria fallos a la hora de realizar la compra */
    if(product.quantity > 1){
      let i=0;
      let access = false;
      while(i<this.products.length && !access){
        if(this.products[i].id == product.id){
          access = true;
        }else{
          i++;
        }
      }
      if(access){
        this.products[i].quantity = this.products[i].quantity - 1;
        this.cartService.updateProduct(index, this.products[i]);
      }
    }
  }
}
