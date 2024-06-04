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
}
