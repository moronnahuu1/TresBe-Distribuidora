import { AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChildren, inject } from '@angular/core';
import { Product } from 'src/app/models/Product';
import { ProductService } from 'src/app/services/product.service';
@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  productsArray: Array<Product> = [];
  productService = inject(ProductService);
  async ngOnInit() {
    (await this.productService.readProducts('rand', null, 1)).subscribe(products => {      
      this.productsArray = products;
    })
  }
}
