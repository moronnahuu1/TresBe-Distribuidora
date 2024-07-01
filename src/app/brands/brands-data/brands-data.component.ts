import { Component, OnInit, inject } from '@angular/core';
import { Brand } from 'src/app/models/Brand';
import { BrandsService } from 'src/app/services/brands.service';

@Component({
  selector: 'app-brands-data',
  templateUrl: './brands-data.component.html',
  styleUrls: ['./brands-data.component.css']
})
export class BrandsDataComponent implements OnInit {
  brandService = inject(BrandsService);
  brandsArray: Array<Brand> = [];
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
}
