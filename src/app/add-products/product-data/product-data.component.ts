import { Component, OnInit, inject } from '@angular/core';
import { Brand } from 'src/app/models/Brand';
import { PriceXproduct } from 'src/app/models/PriceXproduct';
import { Product } from 'src/app/models/Product';
import { BrandsService } from 'src/app/services/brands.service';
import { PricesService } from 'src/app/services/prices.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-data',
  templateUrl: './product-data.component.html',
  styleUrls: ['./product-data.component.css']
})
export class ProductDataComponent implements OnInit{
  productService = inject(ProductService);
  pricesService = inject(PricesService);
  brandService = inject(BrandsService);
  category: string = "";
  brand: string = "";
  brands: Brand[] = [];
  added: boolean = false;

  async ngOnInit() {
    this.added = false;
      (await this.brandService.readBrands()).subscribe(brands => {
        this.brands = brands;
      });
  }
  
  getString(name: string): string{
    let divAux = document.getElementById(name) as HTMLInputElement;
    let miDiv = "";
    if(divAux){
      miDiv = divAux.value;
    }
    return miDiv;
  }

  getNumber(name: string){
    let divAux = document.getElementById(name) as HTMLInputElement;
    let miDiv = 0;
    if(divAux){
      miDiv = parseFloat(divAux.value);
    }
    return miDiv;
  }

  generateRandomId(length: number = 16): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}

  addNewProduct(){
    let id = this.generateRandomId(16);
    let name = this.getString('nameInp');
    let image = this.getString('imageInp');
    let stock = this.getNumber('stockInp');
    let category = this.getString('categoryInp');
    let description = this.getString("descriptionInp");
    let pricelist1 = this.getNumber('price1Inp');
    let pricelist2 = this.getNumber('price2Inp');
    let pricelist3 = this.getNumber('price3Inp');
    let pricelist4 = this.getNumber('price4Inp');

    let productAux = new Product(id, name, category, this.brand, 0, image, stock, description, 1);
    let pricesAux: PriceXproduct = new PriceXproduct(this.generateRandomId(16), id, pricelist1, pricelist2, pricelist3, pricelist4);

    this.productService.saveProduct(productAux).subscribe(() => {});
    this.pricesService.saveProduct(pricesAux).subscribe(() => {});
    this.added = true;
  }
}
