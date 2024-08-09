import { Component, inject, OnInit } from '@angular/core';
import { Brand } from 'src/app/models/Brand';
import { Category } from 'src/app/models/Category';
import { Options } from 'src/app/models/Options';
import { PriceXproduct } from 'src/app/models/PriceXproduct';
import { Product } from 'src/app/models/Product';
import { BrandsService } from 'src/app/services/brands.service';
import { CategoriesService } from 'src/app/services/categories.service';
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
  onBrand: boolean = true;
  onCategory: boolean = false;
  brandSelected: Brand = new Brand('','','');
  categorySelected: Category = new Category('','');
  categories: Category[] = [];
  categoryService = inject(CategoriesService);
  productService = inject(ProductService);
  products: Product[] = [];
  pricesService = inject(PricesService);
  prices: PriceXproduct = new PriceXproduct('','',0,0,0,0,0,0,0);
  optionService = inject(OptionsService);
  options: Options[] = [];
  progressService = inject(ProgressService);
  progress: number = 0;

  async ngOnInit() {
    await this.getBrands();
    await this.getCategories();
    this.progressService.returnNumber().subscribe(numberAux => {
      this.progress = numberAux;
    })
  }
  selectByCategory(){
    this.onBrand = false;
    this.onCategory = true;
  }

  selectByBrand(){
    this.onBrand = true;
    this.onCategory = false;
  }

  async getBrands(){
    (await this.brandService.readBrands()).subscribe(brands => {
      this.brands = brands;
    });
    if(this.brands.length > 0){
      this.brandSelected = this.brands[0];
    }
  }

  async getCategories(){
    (await this.categoryService.readCategories()).subscribe(categoriesAux => {
      this.categories = categoriesAux;
    });
    if(this.categories.length > 0){
      this.categorySelected = this.categories[0];
    }
  }

  async getProducts(){
    if(this.onBrand && !this.onCategory){
      (await this.productService.readProducts('brand', this.brandSelected.name)).subscribe(products => {
        this.products = products;
      });
    }else if(this.onCategory && !this.onBrand){
      (await this.productService.readProducts('category', this.categorySelected.name)).subscribe(products => {
        this.products = products;
      });
    }
  }

  async modifyPrices(percentage: number, option: string){
    for(let i = 0; i<this.products.length; i++){
      (await this.optionService.readProductOptions(this.products[i].id)).subscribe(options => {
        this.options = options;
      });
      if(this.options.length > 0){
        await this.getOptionPrices(this.options, percentage, option);
      }
      let progressAux = ((i * 100) / this.products.length);
      this.progressService.updateNumber(progressAux).subscribe(()=>{});
    }
    this.progressService.updateNumber(100).subscribe(()=>{});
  }

  async getPrice(id: string){
    try {
      const data = await this.pricesService.getTableByProduct(id).toPromise();
      console.log(data);
      return data;
    } catch (error) {
      console.error('Error obteniendo datos:', error);
      throw error; // Puedes manejar el error de acuerdo a tus necesidades
    }
  }

  async getOptionPrices(halfArray: Options[], percentage: number, option: string){
    
    for(let i = 0; i<halfArray.length; i++){
      let pricesAux = await this.getPrice(halfArray[i].id);
      if(pricesAux != undefined){
        this.prices = pricesAux;
      }
      if(option == 'increase'){
        
        this.prices.costPrice = this.prices.costPrice + (this.prices.costPrice * percentage);
        this.prices.priceList1 = (this.prices.costPrice * 1.29);
        this.prices.priceList2 = (this.prices.costPrice * 1.35);
        this.prices.priceList3 = (this.prices.costPrice * 1.50);
        this.prices.priceList4 = (this.prices.costPrice * 1.70);
        this.prices.priceListE = (this.prices.costPrice * 1.16);
        this.prices.priceListG = (this.prices.costPrice * 1.22);

      }else if(option == 'decrease'){
        this.prices.costPrice = (this.prices.costPrice - (this.prices.costPrice * percentage));  
        this.prices.priceList1 = (this.prices.costPrice * 1.29);
        this.prices.priceList2 = (this.prices.costPrice * 1.35);
        this.prices.priceList3 = (this.prices.costPrice * 1.50);
        this.prices.priceList4 = (this.prices.costPrice * 1.70);
        this.prices.priceListE = (this.prices.costPrice * 1.16);
        this.prices.priceListG = (this.prices.costPrice * 1.22);
      }
      await this.pricesService.updateProduct(this.prices.id, this.prices).toPromise();
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
  searchCategoryByName(name: string){
    let i = 0;
    let access = false;

    while(i<this.categories.length && !access){
      if(this.categories[i].name == name){
        access = true;
      }else{
        i++;
      }
    }
    if(access){
      return this.categories[i];
    }else{
      return this.categorySelected;
    }
  }
  selectBrand(event: Event){
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.brandSelected = this.searchBrandByID(selectedValue);
  }
  selectCategory(event: Event){
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.categorySelected = this.searchCategoryByName(selectedValue);
  }
}
