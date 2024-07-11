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
    this.featureModify = false; //Se pone estos dos atributos en falso para garantizar que no se pueda modificar si se esta buscando agregar un nuevo producto
    if (this.activeRoute.snapshot.params.hasOwnProperty('id')) { //Se comprueba que la ruta contenga el ID del producto a modificar
      this.productID = this.activeRoute.snapshot.params['id']; //Si el parametro existe se lo asigna al product ID
    }
    if(this.productID != ''){ //Si el product ID tiene informacion
      this.onModify = await this.readProduct(); //Se busca el producto, si lo encuentra retorna verdadero, por lo que se busca modificar. Si no lo encuentra retorna falso, por lo que se lleva a agregar
      if(this.onModify){ //Si se retorna verdadero en la funcion de read product significa que puede modificar y entra aca
        this.productList = await this.setProductPrice(this.productID); //Se busca las listas de precios de ESE producto encontrado
        (await this.featureService.readProductFeatures(this.productID)).subscribe(featuresAux => {
          this.features = featuresAux; //Se buscan y se retornan las caracteristicas
        });
        this.enableOrDisableInputs(); //Se ponen los input en formato READ ONLY 
      }
    }
    this.added = false; //Propiedad para los mensajes de la pagina
      (await this.brandService.readBrands()).subscribe(brands => {
        this.brands = brands; //Se leen las marcas para seleccionar
      });
  }
  
  getString(name: string): string{ //La funcion sirve para leer cada uno de los input del html, siempre y cuando sean string
    let divAux = document.getElementById(name) as HTMLInputElement;
    let miDiv = "";
    if(divAux){
      miDiv = divAux.value;
    }
    return miDiv;
  }

  getNumber(name: string){ //Misma funcion que la de arriba pero para los numeros
    let divAux = document.getElementById(name) as HTMLInputElement;
    let miDiv = 0;
    if(divAux){
      miDiv = parseFloat(divAux.value);
    }
    return miDiv;
  }

  generateRandomId(length: number = 16): string { //Genera un codigo random de 16 caracteres y lo devuelve. Sirve para los ID
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}

getItemsProduct(){ //Lee los input del producto, crea ese producto y lo retorna
  if(!this.onModify){
    this.productID = this.generateRandomId(16);
  }
  let name = this.getString('nameInp');
  let image = this.getString('imageInp');
  let discount  = this.getNumber('discountInp');
  let category = this.getString('categoryInp');
  let description = this.getString("descriptionInp");

  let productAux = new Product(this.productID, name, category, this.brand, 0, image, discount, description, 1);

  return productAux;
}

getItemsPrice(){ //Lee los input de la lista de precios del producto, crea una nueva lista de precios y la retorna
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

  addNewProduct(){ //La funcion solo sirve para cuando se va a agregar un nuevo producto, NO sirve para MODIFICAR
    let productAux: Product = this.getItemsProduct();
    let pricesAux: PriceXproduct = this.getItemsPrice();

    this.productService.saveProduct(productAux).subscribe(() => {});
    this.pricesService.saveProduct(pricesAux).subscribe(() => {});
    this.added = true; //Al estar en verdadero se activara el mensaje de producto cargado
  }

  enableOrDisableInputs(){ ///Se habilitan o deshabilitan los input de la parte de PRODUCTO, NO CONFUNDIR, SOLO PRODUCTO, NO CARACTERISTICAS
    const productInfo = document.querySelectorAll('.productInfo'); //se seleccionan todos los input con esa clase
    productInfo.forEach(input => { //Para cada uno de los input...
      if(this.toModify == false){ //Si no se quiere modificar y el boton de modificar no se apreta...
        input.setAttribute('disabled', 'disabled'); //Se deshabilita la escritura del input
      }else{ //Si se quiere modificar y el boton de modificar se apreta...
        input.removeAttribute('disabled');  //Se habilita la escritura del input
      }
    });
  }

  modify(){ //Funcion que se invoca cuando se apreta el boton de modificar el producto
    this.toModify = true; //Se quiere modificar, por lo que a modificar va a ser verdadero
    this.modified = false; //Todavia no se ha modificado nada, por lo que esto queda en falso
    this.enableOrDisableInputs(); //Se llama a la funcion para que habilite la escritura de los input SOLO de producto
  }

  modifyOneProduct(){ //Funcion que se invoca cuando se apreta el boton de cambiar, para este paso ya se ha apretado el boton de modificar
    let productAux: Product = this.getItemsProduct(); //Se crea un nuevo producto y se le asignan los input a travez de esa funcion
    let pricesAux: PriceXproduct = this.getItemsPrice(); //Mismo paso que el anterior pero con las listas de precios
    this.pricesService.updateProduct(pricesAux.id, pricesAux).subscribe(()=> {}); 
    this.productService.updateProduct(this.productID, productAux).subscribe(()=>{});
    this.toModify = false; //Despues de modificar todo, el a modificar queda en falso, ya que ya modificó lo que quiso y lo guardó
    this.modified = true; //Despues de modificar todo, el modificado queda en verdadero, para que el html detecte esto y ponga el mensaje de modificacion correcta
    this.enableOrDisableInputs(); //Se vuelve a cambiar la habilitacion de los inputs del producto, en este caso se van a deshabilitar nuevamente
  }

  async readProduct(){ //Lee el producto que se trae POR PARAMETRO unicamente si lo que se desea es MODIFICAR
    let productAux = await this.getProduct();
    if(productAux){
      this.modifyProduct = productAux; //El modify product queda asignado como el producto a modificar, todos los datos del producto tomado por parametro son los datos que van a quedar en esta variable
      return true; //Si el producto existe retorna verdadero para saber que se va a modificar algo existente
    }else{
      return false; //Si el producto no existe retorna falso y no deja modificar, solo agregar
    }
  }

  async getProduct(){ //Funcion para traer el producto desde la base de datos pasando primero por el servicio del producto
    try {
      const data = await this.productService.getProduct(this.productID).toPromise();
      console.log(data);
      return data;
    } catch (error) {
      console.error('Error obteniendo datos:', error);
      throw error; // Puedes manejar el error de acuerdo a tus necesidades
    }
  }

  getValue(name: string){ //Para la informacion de los inputs si vas a modificar un producto
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

        case "discount": 
        return this.modifyProduct.discount;

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
