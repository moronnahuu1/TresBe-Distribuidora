import { Component, inject, OnInit } from '@angular/core';
import { Product } from 'src/app/models/Product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-discount-data',
  templateUrl: './discount-data.component.html',
  styleUrls: ['./discount-data.component.css']
})
export class DiscountDataComponent implements OnInit{
  productService = inject(ProductService);
  products: Array<Product> = [];

  ngOnInit(): void {
      this.productService.returnObservable().subscribe(products => {
        this.products = products;
      });
  }

  setDiscount(){
    let miInp = document.getElementById('discountInp') as HTMLInputElement;
    let inputParsed = 0;
    if(miInp){
      inputParsed = parseFloat(miInp.value);
    }
    if(inputParsed > 0){
      if(this.products.length > 0){
        for(let i = 0; i<this.products.length; i++){
          this.products[i].discount = inputParsed;
          this.productService.updateProduct(this.products[i].id, this.products[i]).subscribe(()=>{});
        }
      }
    }
  }
  deleteDiscounts(){
    if(this.products.length > 0){
      for(let i = 0; i<this.products.length; i++){
        this.products[i].discount = 0;
        this.productService.updateProduct(this.products[i].id, this.products[i]).subscribe(()=>{});
      }
    }
  }
}
