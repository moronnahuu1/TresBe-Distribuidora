import { Component, inject, OnInit } from '@angular/core';
import { Product } from 'src/app/models/Product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-discount-products',
  templateUrl: './discount-products.component.html',
  styleUrls: ['./discount-products.component.css']
})
export class DiscountProductsComponent implements OnInit{
  productService = inject(ProductService);
  products: Array<Product> = [];

  ngOnInit(): void {
      this.productService.returnObservable().subscribe(products => {
        this.products = products;
      });
  }
}
