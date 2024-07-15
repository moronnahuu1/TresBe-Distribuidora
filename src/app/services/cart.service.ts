import { Injectable } from '@angular/core';
import { Product } from '../models/Product';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartProducts: Array<Product> = []
  private subTotal: number = 0;
  private total: number = 0;
  private discount: number = 0;
  private delivery: number = 0;
  private _subTotal: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  private _Total: BehaviorSubject<number> = new BehaviorSubject<number>(0);
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

  addNewProduct(productAux: Product, optionSeleted: string){
    productAux.optionSelected = optionSeleted;
    this.cartProducts.push(productAux);
    localStorage.removeItem("cart");
    localStorage.setItem("cart", JSON.stringify(this.cartProducts));
    this._products.next(this.cartProducts);
  }

  saveCartAfterOrder(){
    localStorage.setItem("cartResolved", JSON.stringify(this.cartProducts));
    localStorage.removeItem("cart");
    this.cartProducts = [];
    this._products.next(this.cartProducts);
  }

  deleteProduct(index: number){
    this.cartProducts.splice(index, 1);
    localStorage.removeItem("cart");
    localStorage.setItem("cart", JSON.stringify(this.cartProducts));
    this._products.next(this.cartProducts);
    this.subTotal = 0;
    for(let i=0; i<this.cartProducts.length; i++){
      let priceProduct = 0;
      if(this.cartProducts[i].discount > 0){
        priceProduct = this.cartProducts[i].priceDiscount;
      }else{
        priceProduct = this.cartProducts[i].price;
      }
      this.subTotal += (priceProduct * this.cartProducts[i].quantity);
      this._subTotal.next(this.subTotal);
    }
    this.total = 0;
    this.total = this.subTotal + this.delivery - this.discount;
    this._Total.next(this.total);
  }
  updateProduct(index: number, product: Product){
    this.cartProducts[index] = product;
    localStorage.removeItem("cart");
    localStorage.setItem("cart", JSON.stringify(this.cartProducts));
    this._products.next(this.cartProducts);
    this.subTotal = 0;
    for(let i=0; i<this.cartProducts.length; i++){
      let priceProduct = 0;
      if(this.cartProducts[i].discount > 0){
        priceProduct = this.cartProducts[i].priceDiscount;
      }else{
        priceProduct = this.cartProducts[i].price;
      }
      this.subTotal += (priceProduct * this.cartProducts[i].quantity);
      this._subTotal.next(this.subTotal);
    }
    this.total = 0;
    this.total = this.subTotal + this.delivery - this.discount;
    this._Total.next(this.total);
  }
  getSubtotal(){
    this.subTotal = 0;
    for(let i=0; i<this.cartProducts.length; i++){
      let priceProduct = 0;
      if(this.cartProducts[i].discount > 0){
        priceProduct = this.cartProducts[i].priceDiscount;
      }else{
        priceProduct = this.cartProducts[i].price;
      }
      this.subTotal += (priceProduct * this.cartProducts[i].quantity);
      this._subTotal.next(this.subTotal);
    }
    this.total = 0;
    this.total = this.subTotal + this.delivery - this.discount;
    this._Total.next(this.total);
    return this._subTotal.asObservable();
  }

  getTotal(){
    this.total = 0;
    this.total = this.subTotal + this.delivery - this.discount;
    this._Total.next(this.total);

    return this._Total.asObservable();
  }
}
