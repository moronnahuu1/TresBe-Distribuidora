import { Component, OnInit, inject } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Product } from '../models/Product';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.css']
})
export class ProductsListComponent implements OnInit{
  productsArray: Array<Product> = [];
  productService = inject(ProductService);
  activeRoute = inject(ActivatedRoute);
  category: string = "";
  brand: string = "";
  async ngOnInit() {
    await this.filters();
  }

  async filters(){
    const categoryAux = this.activeRoute.snapshot.params['category'];
    const brandAux = this.activeRoute.snapshot.params['brand'];
    if(brandAux){
      this.brand = brandAux;
      (await this.productService.readProducts('brand', this.brand)).subscribe(products => {
        this.productsArray = products;
      });
    }
    if(categoryAux){
      this.category = categoryAux;
      (await this.productService.readProducts('category', this.category)).subscribe(products =>{
        this.productsArray = products;
      }
      );
    }
    if(!brandAux && !categoryAux){
      (await this.productService.readProducts("all", null)).subscribe(products => {
        this.productsArray = products;
      });
    }
  }
  isAdmin(){
    let access = localStorage.getItem("admin");
    let admin = false;
    if(access){
      admin = JSON.parse(access);
    }
    return admin;
  }
  formatNumber(number: number): string {
    return number.toLocaleString(); // Esto añadirá separadores de miles
  }
}
