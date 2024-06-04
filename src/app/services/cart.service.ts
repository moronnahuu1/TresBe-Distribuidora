import { Injectable } from '@angular/core';
import { Product } from '../models/Product';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartProducts: Array<Product> = []
  private _products: BehaviorSubject<Product[]> = new BehaviorSubject<Product[]>([]);
  constructor() { }

  getProducts(){
    let productsAux = localStorage.getItem("cart");
    if(productsAux){
      this.cartProducts = JSON.parse(productsAux);
      this._products.next(this.cartProducts);
    }
    return this._products.asObservable();
  }

  addNewProduct(product: Product){
    this.cartProducts.push(product);
    localStorage.removeItem("cart");
    localStorage.setItem("cart", JSON.stringify(this.cartProducts));
    this._products.next(this.cartProducts);
  }

  deleteProduct(index: number){
    this.cartProducts.splice(index, 1);
    localStorage.removeItem("cart");
    localStorage.setItem("cart", JSON.stringify(this.cartProducts));
    this._products.next(this.cartProducts);
  }
}
