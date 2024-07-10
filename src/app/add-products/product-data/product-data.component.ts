import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Brand } from 'src/app/models/Brand';
import { Feature } from 'src/app/models/Feature';
import { PriceXproduct } from 'src/app/models/PriceXproduct';
import { Product } from 'src/app/models/Product';
import { BrandsService } from 'src/app/services/brands.service';
import { FeatureService } from 'src/app/services/feature.service';
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
  productID: string = '';
  productList: PriceXproduct = new PriceXproduct('','',0,0,0,0);
  pricesID: string = '';
  modifyProduct: Product = new Product('','','','',0,'',0,'',0);
  activeRoute = inject(ActivatedRoute);
  onModify: boolean = false;
  toModify: boolean = false;
  modified: boolean = false;
  featureModify: boolean = false;
  features: Array<Feature> = [];
  featureService = inject(FeatureService);

  async ngOnInit() {
    this.modified = false;
    this.featureModify = false;
    if (this.activeRoute.snapshot.params.hasOwnProperty('id')) {
      this.productID = this.activeRoute.snapshot.params['id'];
    }
    if(this.productID != ''){
      this.onModify = await this.readProduct();
      if(this.onModify){
        this.productList = await this.setProductPrice(this.productID);
        (await this.featureService.readProductFeatures(this.productID)).subscribe(featuresAux => {
          this.features = featuresAux;
        });
        this.enableOrDisableInputs();
      }
    }
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

getItemsProduct(){
  if(!this.onModify){
    this.productID = this.generateRandomId(16);
  }
  let name = this.getString('nameInp');
  let image = this.getString('imageInp');
  let stock = this.getNumber('stockInp');
  let category = this.getString('categoryInp');
  let description = this.getString("descriptionInp");

  let productAux = new Product(this.productID, name, category, this.brand, 0, image, stock, description, 1);

  return productAux;
}

getItemsPrice(){
  if(!this.onModify){
    this.pricesID = this.generateRandomId(16);
  }else{
    this.pricesID = this.productList.id;
  }
  let pricelist1 = this.getNumber('price1Inp');
  let pricelist2 = this.getNumber('price2Inp');
  let pricelist3 = this.getNumber('price3Inp');
  let pricelist4 = this.getNumber('price4Inp');
  let pricesAux: PriceXproduct = new PriceXproduct(this.pricesID, this.productID, pricelist1, pricelist2, pricelist3, pricelist4);

  return pricesAux;
}

  addNewProduct(){
    let productAux: Product = this.getItemsProduct();
    let pricesAux: PriceXproduct = this.getItemsPrice();

    this.productService.saveProduct(productAux).subscribe(() => {});
    this.pricesService.saveProduct(pricesAux).subscribe(() => {});
    this.added = true;
  }

  enableOrDisableInputs(){
    const productInfo = document.querySelectorAll('.productInfo');
    productInfo.forEach(input => {
      if(this.toModify == false){
        input.setAttribute('disabled', 'disabled');
      }else{
        input.removeAttribute('disabled');
      }
    });
  }

  modify(){
    this.toModify = true;
    this.modified = false;
    this.enableOrDisableInputs();
  }

  modifyOneProduct(){
    let productAux: Product = this.getItemsProduct();
    let pricesAux: PriceXproduct = this.getItemsPrice();
    this.pricesService.updateProduct(pricesAux.id, pricesAux).subscribe(()=> {});
    this.productService.updateProduct(this.productID, productAux).subscribe(()=>{});
    this.toModify = false;
    this.modified = true;
    this.enableOrDisableInputs();
  }

  async readProduct(){
    let productAux = await this.getProduct();
    if(productAux){
      this.modifyProduct = productAux;
      return true;
    }else{
      return false;
    }
  }

  async getProduct(){
    try {
      const data = await this.productService.getProduct(this.productID).toPromise();
      console.log(data);
      return data;
    } catch (error) {
      console.error('Error obteniendo datos:', error);
      throw error; // Puedes manejar el error de acuerdo a tus necesidades
    }
  }

  getValue(name: string){
    if(name != "" && this.modifyProduct.id != ''){
      switch(name){
        case "name": 
        return this.modifyProduct.name;

        case "category": 
        return this.modifyProduct.category;

        case "brand": 
        return this.modifyProduct.brand;

        case "image": 
        return this.modifyProduct.image;

        case "stock": 
        return this.modifyProduct.stock;

        case "price1": 
        return this.productList.priceList1;

        case "price2": 
        return this.productList.priceList2;

        case "price3": 
        return this.productList.priceList3;

        case "price4": 
        return this.productList.priceList4;
      }
      return "";
    }else{
      return "";
    }
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

  async setProductPrice(productID: string){
    let data = await this.getPrice(productID);
    let priceAux: PriceXproduct = new PriceXproduct('','',0, 0,0,0);
    if(data != undefined){
      priceAux = data;
    }
    return priceAux;
  }

  modifyFeatures(feature: Feature, index: number){
    this.featureModify = true;
    this.enableOrDisableFeatures(feature.name, feature.value);
    let featureName = this.getString(feature.name);
    let featureValue = this.getString(feature.value);
    feature.name = featureName;
    feature.value = featureValue;
    this.featureService.updateOneFeature(index, feature);
    this.featureModify = false;
  }
  enableOrDisableFeatures(name: string, value: string){
    const nameAux = document.getElementById(name) as HTMLInputElement;
    const valueAux = document.getElementById(value) as HTMLInputElement;
    if(this.featureModify == false){
        nameAux.setAttribute('disabled', 'disabled');
        valueAux.setAttribute('disabled', 'disabled');
      }else{
        nameAux.removeAttribute('disabled');
        valueAux.removeAttribute('disabled');
      }
  }
  deleteFeature(featureID: string | undefined, index: number){
    if(featureID != undefined){
      this.featureService.deleteOneFeature(featureID, index);
    }
  }
  addFeature(){
    let featureName = this.getString('featureInp');
    let featureValue = this.getString('featureValueInp');
    let featureAux = new Feature(this.generateRandomId(16), featureName, featureValue, this.productID);
    this.featureService.createFeature(featureAux);
  }
}
