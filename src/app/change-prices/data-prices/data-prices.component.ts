import { Component, inject, OnInit } from '@angular/core';
import { Brand } from 'src/app/models/Brand';
import { Options } from 'src/app/models/Options';
import { PriceXproduct } from 'src/app/models/PriceXproduct';
import { Product } from 'src/app/models/Product';
import { BrandsService } from 'src/app/services/brands.service';
import { OptionsService } from 'src/app/services/options.service';
import { PricesService } from 'src/app/services/prices.service';
import { ProductService } from 'src/app/services/product.service';
import { ProgressService } from 'src/app/services/progress.service';

@Component({
  selector: 'app-data-prices',
  templateUrl: './data-prices.component.html',
  styleUrls: ['./data-prices.component.css']
})
export class DataPricesComponent implements OnInit{
  brandService = inject(BrandsService);
  brands: Brand[] = [];
  brandSelected: Brand = new Brand('','','');
  productService = inject(ProductService);
  products: Product[] = [];
  pricesService = inject(PricesService);
  prices: PriceXproduct = new PriceXproduct('','',0,0,0,0);
  optionService = inject(OptionsService);
  options: Options[] = [];
  progressService = inject(ProgressService);
  progress: number = 0;

  async ngOnInit() {
    await this.getBrands();
    this.progressService.returnNumber().subscribe(numberAux => {
      this.progress = numberAux;
    })
  }

  async getBrands(){
    (await this.brandService.readBrands()).subscribe(brands => {
      this.brands = brands;
    });
    if(this.brands.length > 0){
      this.brandSelected = this.brands[0];
    }
  }

  async getProducts(){
    (await this.productService.readProducts('brand', this.brandSelected.name)).subscribe(products => {
      this.products = products;
    });
  }

  async modifyPrices(percentage: number, option: string){
    for(let i = 0; i<this.products.length; i++){
      (await this.optionService.readProductOptions(this.products[i].id)).subscribe(options => {
        this.options = options;
      });
      if(this.options.length > 1){
        const middleIndex = Math.ceil(this.options.length / 2);

        const firstHalf = this.options.splice(0, middleIndex);
        const secondHalf = this.options;
        await this.getOptionPrices(firstHalf, percentage, option);
        await this.getOptionPrices(secondHalf, percentage, option);
      }else{
        this.getOptionPrices(this.options, percentage, option);
      }
      let progressAux = ((i * 100) / this.products.length);
      this.progressService.updateNumber(progressAux).subscribe(()=>{});
    }
    this.progressService.updateNumber(100).subscribe(()=>{});
  }

  async getOptionPrices(halfArray: Options[], percentage: number, option: string){
    
    for(let i = 0; i<halfArray.length; i++){
      (await this.pricesService.readTableByProduct(halfArray[i].id)).subscribe(prices => {
        this.prices = prices;
      });
      if(option == 'increase'){
        
        this.prices.priceList1 = (this.prices.priceList1 + (this.prices.priceList1 * percentage));
        this.prices.priceList2 = (this.prices.priceList2 + (this.prices.priceList2 * percentage));
        this.prices.priceList3 = (this.prices.priceList3 + (this.prices.priceList3 * percentage));
        this.prices.priceList4 = (this.prices.priceList4 + (this.prices.priceList4 * percentage));
      }else if(option == 'decrease'){
        this.prices.priceList1 = (this.prices.priceList1 - (this.prices.priceList1 * percentage));
        this.prices.priceList2 = (this.prices.priceList2 - (this.prices.priceList2 * percentage));
        this.prices.priceList3 = (this.prices.priceList3 - (this.prices.priceList3 * percentage));
        this.prices.priceList4 = (this.prices.priceList4 - (this.prices.priceList4 * percentage));
      }
      this.pricesService.updateProduct(this.prices.id, this.prices).subscribe(()=>{});
    }
  }

  async changePrices(option: string){
    let inpAux = document.getElementById('percentageInp') as HTMLInputElement;
    if(inpAux){
      let percentage = parseFloat(inpAux.value);
      if(percentage > 0){
        let confirmed = confirm('Cambiar los precios en ' + percentage + '% ?');
        if(confirmed){
          await this.getProducts();
          
          await this.modifyPrices(percentage, option);
        }
      }
    }
  }
  searchBrandByID(brandID: string){
    let i = 0;
    let access = false;

    while(i<this.brands.length && !access){
      if(this.brands[i].name == brandID){
        access = true;
      }else{
        i++;
      }
    }
    if(access){
      return this.brands[i];
    }else{
      return this.brandSelected;
    }
  }
  selectBrand(brandID: string){
    this.brandSelected = this.searchBrandByID(brandID);
  }
}
