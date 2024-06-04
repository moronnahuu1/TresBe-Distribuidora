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
  async ngOnInit() {
    const categoryAux = this.activeRoute.snapshot.params['category'];
    if(categoryAux){
      this.category = categoryAux;
      await this.filterByCategory(categoryAux);
    }else{
      await this.readProducts();
    }
  }
  async readProducts(): Promise<void> {
      const productsAux = await this.getProducts();
      if(productsAux != undefined){
        for(let i=0; i<productsAux.length; i++){
          this.productsArray.push(productsAux[i]);
        }
      }
  }
  async getProducts(): Promise<Product[] | undefined>{
    try {
      const data = await this.productService.getProducts().toPromise();
      console.log(data?.length);
      return data;
    } catch (error) {
      console.error('Error obteniendo datos:', error);
      throw error; // Puedes manejar el error de acuerdo a tus necesidades
    }
  }
  async filterByCategory(category: string){
    const productsAux = await this.getProducts();
      if(productsAux != undefined){
        for(let i=0; i<productsAux.length; i++){
          if(productsAux[i].category == category){
            this.productsArray.push(productsAux[i]);
          }
        }
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
