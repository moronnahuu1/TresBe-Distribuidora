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
        this.products = products;
      })
      this.startQuantity();
  }
  deleteProduct(index: number){
    this.cartService.deleteProduct(index);
  }
  startQuantity(){
    for(let i=0; i<this.products.length; i++){
      if(!this.products[i].quantity){
        this.products[i].quantity = 1;
      }
    }
  }
  incrementQuantity(product: Product, index: number){
    if(product.quantity < product.stock){
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
    }
  }

  decrementQuantity(product: Product, index: number){
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
