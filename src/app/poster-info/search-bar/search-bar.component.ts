import { Component, inject, OnInit } from '@angular/core';
import { Product } from 'src/app/models/Product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent implements OnInit{
  searchTerm: string = '';
  productService = inject(ProductService);
  products: Product[] = [];
  ngOnInit(): void {
      this.addEventButton();
  }
  async updateSearchResults(){
    if(this.searchTerm != ''){
      (await this.productService.readProducts('search', this.searchTerm, 1)).subscribe(products => {
        this.products = products;
      });
    }
  }
  addEventButton(){
    let myButton = document.getElementById('myButton') as HTMLButtonElement;
    let myInput = document.getElementById('searchbarInp') as HTMLInputElement;
    myInput.addEventListener('keypress', (evento) => {
      if(evento.key === 'Enter'){
        evento.preventDefault(); // Evita el comportamiento por defecto del Enter
        myButton.click();
      }
    })
  }
}
