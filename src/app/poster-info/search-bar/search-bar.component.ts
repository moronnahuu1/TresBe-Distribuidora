import { Component, inject } from '@angular/core';
import { Product } from 'src/app/models/Product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent {
  searchTerm: string = '';
  productService = inject(ProductService);
  products: Product[] = [];
  async updateSearchResults(){
    if(this.searchTerm != ''){
      (await this.productService.readProducts('search', this.searchTerm)).subscribe(products => {
        this.products = products;
      });
    }
  }
}
