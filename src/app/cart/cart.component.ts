import { Component, OnInit, inject } from '@angular/core';
import { CartService } from '../services/cart.service';
import { Product } from '../models/Product';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit{
  cartService = inject(CartService);
  products: Array<Product> = [];

  ngOnInit(): void {
      this.cartService.getProducts().subscribe(products => {
        this.products = products;
      })
  }
  deleteProduct(index: number){
    this.cartService.deleteProduct(index);
  }
}
