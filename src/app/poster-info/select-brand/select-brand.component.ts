import { Component, OnInit, inject } from '@angular/core';
import { Brand } from 'src/app/models/Brand';
import { BrandsService } from 'src/app/services/brands.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-select-brand',
  templateUrl: './select-brand.component.html',
  styleUrls: ['./select-brand.component.css']
})
export class SelectBrandComponent implements OnInit{
  brandService = inject(BrandsService);
  brandsArray: Array<Brand> = [];
  productService = inject(ProductService);
  ngOnInit(): void {
      this.readBrands();
  }
  async readBrands(){
    const brandsAux = await this.getBrands();
      if(brandsAux != undefined){
        for(let i=0; i<brandsAux.length; i++){
          this.brandsArray.push(brandsAux[i]);
        }
      }
  }
  async getBrands(){
    try {
      const data = await this.brandService.getBrands().toPromise();
      console.log(data?.length);
      return data;
    } catch (error) {
      console.error('Error obteniendo datos:', error);
      throw error; // Puedes manejar el error de acuerdo a tus necesidades
    }
  }

  async onSelectBrand(brand: string){
    this.brandService.changeSelected(brand);
    this.productService.changeLoading('true').subscribe(()=>{});
    if(brand == 'all'){
      window.location.href = '/products'
    }else{
      window.location.href = `/brands/products/${brand}`
    }
    this.productService.changeLoading('false').subscribe(()=>{});
  }
  isAdmin(){
    if(localStorage.getItem('admin')){
      return true;
    }else{
      return false;
    }
  }
}
