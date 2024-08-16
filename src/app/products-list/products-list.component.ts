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
  loading: boolean = false;
  currentPage: number = 1;
  pageSize: number = 12;
  productsNotPayed: Product[] = [];
  async ngOnInit() {
    window.scrollTo(0, 0);
    await this.filters();
    ///this.hasCostPrice();
  }

  async filters(){ //Funcion para filtrar los productos, puede ser por categoria o por marca
    this.productService.changeLoading('true').subscribe(loadAux => {
      this.loading = loadAux;
    });
    const categoryAux = this.activeRoute.snapshot.params['category']; //En ambos casos se leen los parametros de la ruta para ver si se trata de una marca o una categoria
    const brandAux = this.activeRoute.snapshot.params['brand'];
    if(brandAux){ //Si es una marca
      this.brand = brandAux; //Se asigna la marca a una variable global para manejarla luego en el html
      (await this.productService.readProducts('brand', this.brand)).subscribe(products => { //Se leen los productos desde el servicio con la marca registrada como parametro
        this.productsArray = products;
      });
    }
    if(categoryAux){ //Si es una categoria
      this.category = categoryAux; //Se asigna la categoria a una variable global para manejarla luego en el html
      (await this.productService.readProducts('category', this.category)).subscribe(products =>{ //Se leen los productos desde el servicio con la categoria registrada como parametro
        this.productsArray = products;
      }
      );
    }
    if(!brandAux && !categoryAux){ //Si no hay parametros, ni marca ni categoria, se leen todos los productos
      (await this.productService.readProducts("all", null)).subscribe(products => {
        this.productsArray = products;
      });
    }
    this.productService.changeLoading('false').subscribe(loadAux => {
      this.loading = loadAux;
    }); 
   }
   hasCostPrice(){
    for(let i=0; i<this.productsArray.length; i++){
      if(this.productsArray[i].price < 2){
        this.productsNotPayed.push(this.productsArray[i]);
      }
    }
    alert(this.productsNotPayed.length)
   }
  isAdmin(){ //funcion para detectar si el usuario logueado es administrador
    let access = localStorage.getItem("admin");
    let admin = false;
    if(access){
      admin = JSON.parse(access);
    }
    return admin;
  }
  formatNumber(number: number): string { //Funcion de front, se usa en HTML para mostrar los numeros grandes de forma mas legible.
    return number.toLocaleString(); // Esto añadirá separadores de miles
  }
  deleteProduct(productID: string){
    let confirmation = confirm("Eliminar producto?");
    if(confirmation){
      this.productService.deleteProduct(productID).subscribe(()=>{});
    }
  }

  paginatedProducts(): Product[] {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.productsArray.slice(start, end);
  }

  nextPage() {
    if ((this.currentPage * this.pageSize) < this.productsArray.length) {
      this.currentPage++;
      window.scrollTo(0, 500);
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      window.scrollTo(0, 500);
    }
  }
}
