import { Component, inject } from '@angular/core';
import { Product } from 'src/app/models/Product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-pay',
  templateUrl: './pay.component.html',
  styleUrls: ['./pay.component.css']
})
export class PayComponent {
  cartService = inject(CartService);
  productService = inject(ProductService);
  cartProducts: Array<Product> = [];
  products: Array<Product> = [];
  subtotal: number = 0;
  total: number = 0;
  ngOnInit(): void {
    this.cartService.getProducts().subscribe(products => {
      this.cartProducts = products;
    })

    this.productService.getProducts().subscribe(products => {
      this.products = products;
    })

    this.cartService.getTotal().subscribe(total => {
      this.total = total;
    })
  }
  modifyStock(action: string){
    let productID: string = "";
    for(let i=0; i<this.products.length; i++){
      for(let j=0; j<this.cartProducts.length; j++){
        if(this.products[i].id == this.cartProducts[j].id){
          if(action == "discount"){
            this.products[i].stock = this.products[i].stock - this.cartProducts[j].quantity;
          }else if(action == "add"){
            this.products[i].stock = this.products[i].stock + this.cartProducts[j].quantity;
          }
          productID = this.products[i].id ?? "";
          alert("MODIFYING");
          this.productService.updateProduct(productID, this.products[i]);
        }
      }
    }
  }
  placeOrder(){
    this.modifyStock("discount");
    this.cartService.saveCartAfterOrder();
  }
}
