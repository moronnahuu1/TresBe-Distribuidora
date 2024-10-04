import { Component, OnInit, inject } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Product } from '../models/Product';
import { ActivatedRoute } from '@angular/router';
import { CartService } from '../services/cart.service';
import { OptionsService } from '../services/options.service';
import { BrandsService } from '../services/brands.service';
import { CategoriesService } from '../services/categories.service';
import Swal from 'sweetalert2';
import { PublicUser } from '../models/PublicUser';
import { CookieService } from '../services/cookie.service';

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
  categoryService = inject(CategoriesService);
  brand: string = "";
  loading: boolean = false;
  currentPage: number = 1;
  pageSize: number = 12;
  productsNotPayed: Product[] = [];
  cartService = inject(CartService);
  optionsService = inject(OptionsService);
  onCart: Boolean = false;
  totalPages: number = 0;
  brandService = inject(BrandsService);
  admin: PublicUser = new PublicUser('','','','',false);
  cookieService = inject(CookieService);
  async ngOnInit() {
    window.scrollTo(0, 0);
    await this.filters();
    (await this.cookieService.getAdmin()).subscribe(data => {
      this.admin = data;
    });
    ///this.hasCostPrice();
  }

  async readCounts(value: string, type: string){
    (await this.productService.readCounts(value, type)).subscribe(pages => {
      this.totalPages = pages;
    });
    this.productService.getCurrentPage().subscribe(page => {
      this.currentPage = page;
    });
  }

  async filters(){ //Funcion para filtrar los productos, puede ser por categoria o por marca
    this.productService.changeLoading('true').subscribe(loadAux => {
      this.loading = loadAux;
    });
    const categoryAux = this.activeRoute.snapshot.params['category']; //En ambos casos se leen los parametros de la ruta para ver si se trata de una marca o una categoria
    const brandAux = this.activeRoute.snapshot.params['brand'];
    if(brandAux){ //Si es una marca
      this.brand = brandAux; //Se asigna la marca a una variable global para manejarla luego en el html
      this.brandService.changeSelected(brandAux);
      (await this.productService.readProducts('brand', this.brand)).subscribe(products => { //Se leen los productos desde el servicio con la marca registrada como parametro
        this.productsArray = products;
      });
      await this.readCounts('brand',this.brand);
    }
    if(categoryAux){ //Si es una categoria
      this.category = categoryAux; //Se asigna la categoria a una variable global para manejarla luego en el html
      this.categoryService.changeSelected(categoryAux);
      (await this.productService.readProducts('category', this.category)).subscribe(products =>{ //Se leen los productos desde el servicio con la categoria registrada como parametro
        this.productsArray = products;
      }
      );
      await this.readCounts('category', this.category);
    }
    if(!brandAux && !categoryAux){ //Si no hay parametros, ni marca ni categoria, se leen todos los productos
      (await this.productService.readProducts("all", null)).subscribe(products => {
        this.productsArray = products;
      });
      await this.readCounts('all','all');
    }
    this.productService.changeLoading('false').subscribe(loadAux => {
      this.loading = loadAux;
    }); 
   }
   hasCostPrice(){
    for(let i=0; i<this.productsArray.length; i++){
      if(this.productsArray[i].price < 2){
      }else{
        this.productsArray.splice(i, 1);
      }
    }
   }
  isAdmin(){ //funcion para detectar si el usuario logueado es administrador
    if(this.admin.email != ''){
      return true;
    }else{
      return false;
    }
  }
  formatNumber(number: number): string { //Funcion de front, se usa en HTML para mostrar los numeros grandes de forma mas legible.
    return number.toLocaleString(); // Esto añadirá separadores de miles
  }
  async deleteProduct(productID: string){
    let confirmation = confirm("Eliminar producto?");
    if(confirmation){
      await this.productService.deleteProduct(productID).toPromise();
      await this.optionsService.deleteOptionByProduct(productID).toPromise();
    }
  }

  paginatedProducts(): Product[] {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.productsArray.slice(start, end);
  }

  async nextPage() {
      this.productService.setPageNumber(this.currentPage+1);
      await this.filters();
      window.scrollTo(0, 500);
  }
  async pageChange(){
    this.productService.setPageNumber(this.currentPage);
    await this.filters();
      window.scrollTo(0, 500);
  }
  async previousPage() {
    if (this.currentPage > 1) {
      this.productService.setPageNumber(this.currentPage-1);
      await this.filters();
      window.scrollTo(0, 500);
    }
  }
}
