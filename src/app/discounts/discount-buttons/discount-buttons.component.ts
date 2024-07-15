import { Component, inject, OnInit } from '@angular/core';
import { Product } from 'src/app/models/Product';
import { DiscountsService } from 'src/app/services/discounts.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-discount-buttons',
  templateUrl: './discount-buttons.component.html',
  styleUrls: ['./discount-buttons.component.css']
})
export class DiscountButtonsComponent implements OnInit{
  productService = inject(ProductService);
  products: Array<Product> = [];
  discountService = inject(DiscountsService);

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
      this.discountService.changeBoolean('added', true);
      this.discountService.changeBoolean('deleted', false);
      window.scrollTo(0,0);
    }else{
      this.discountService.changeBoolean('added', false);
    }
  }
  deleteDiscounts(){
    if(this.products.length > 0){
      for(let i = 0; i<this.products.length; i++){
        this.products[i].discount = 0;
        this.productService.updateProduct(this.products[i].id, this.products[i]).subscribe(()=>{});
      }
      this.discountService.changeBoolean('deleted', true);
      this.discountService.changeBoolean('added', false);
      window.scrollTo(0,0);
    }else{
      this.discountService.changeBoolean('deleted', false);
    }
  }
}
