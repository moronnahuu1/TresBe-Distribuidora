import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Brand } from 'src/app/models/Brand';
import { Feature } from 'src/app/models/Feature';
import { Options } from 'src/app/models/Options';
import { PriceXproduct } from 'src/app/models/PriceXproduct';
import { Product } from 'src/app/models/Product';
import { BrandsService } from 'src/app/services/brands.service';
import { CouponService } from 'src/app/services/coupon.service';
import { FeatureService } from 'src/app/services/feature.service';
import { OptionsService } from 'src/app/services/options.service';
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
  productList: PriceXproduct = new PriceXproduct('','',0,0,0,0,0,0,0);
  pricesID: string = '';
  modifyProduct: Product = new Product('','','','',0,'',0,'',0,0);
  activeRoute = inject(ActivatedRoute);
  onModify: boolean = false;
  toModify: boolean = false;
  modified: boolean = false;
  featureModify: boolean = false;
  features: Array<Feature> = [];
  featureService = inject(FeatureService);
  options: Options[] = [];
  optionService = inject(OptionsService);
  allPrices: PriceXproduct[] = [];
  optionSelected: Options = new Options('','','', 0);
  optionTerm: string = '';
  optionUpdated: boolean = false;
  searchTerm: string = '';
  optionsSearched: Options[] = [];
  async ngOnInit() {
    this.modified = false;
    this.optionUpdated = this.messageUpdated();
    this.featureModify = false; //Se pone estos dos atributos en falso para garantizar que no se pueda modificar si se esta buscando agregar un nuevo producto
    if (this.activeRoute.snapshot.params.hasOwnProperty('id')) { //Se comprueba que la ruta contenga el ID del producto a modificar
      this.productID = this.activeRoute.snapshot.params['id']; //Si el parametro existe se lo asigna al product ID
    }
    (await this.brandService.readBrands()).subscribe(brands => {
      this.brands = brands; //Se leen las marcas para seleccionar
      if(!this.onModify){
        this.brand = this.brands[0].name;
      }
    });
    if(this.productID != ''){ //Si el product ID tiene informacion
      this.onModify = await this.readProduct(); //Se busca el producto, si lo encuentra retorna verdadero, por lo que se busca modificar. Si no lo encuentra retorna falso, por lo que se lleva a agregar
      if(this.onModify){ //Si se retorna verdadero en la funcion de read product significa que puede modificar y entra aca
        (await this.featureService.readProductFeatures(this.productID)).subscribe(featuresAux => {
          this.features = featuresAux; //Se buscan y se retornan las caracteristicas
        });
        this.enableOrDisableInputs(); //Se ponen los input en formato READ ONLY 
      }
    }
    this.added = false; //Propiedad para los mensajes de la pagina
    
      this.optionService.getProductOptions(this.productID).subscribe(async options => {
        this.options = options;
        await this.getAllPrices();
        this.optionSelected = options[0];
        this.optionTerm = this.optionSelected.name;
        this.productList = this.returnPrice(this.optionSelected.id);
      });
  }
  
  getString(name: string): string{ //La funcion sirve para leer cada uno de los input del html, siempre y cuando sean string
    let divAux = document.getElementById(name) as HTMLInputElement;
    let miDiv = "";
    if(divAux != null && divAux != undefined){
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

  if(name.length == 0 || image.length == 0 || category.length == 0){
    alert('Los campos con asteriscos no pueden estar vacíos');
    return null;
  }

  let productAux = new Product(this.productID, name, category, this.brand, 0, image, discount, description, 1, 0);
  return productAux;
}

getItemsPrice(optionID: string, toDo: string){ //Lee los input de la lista de precios del producto, crea una nueva lista de precios y la retorna
  if(toDo == 'add'){
    this.pricesID = this.generateRandomId(16);
    let costPrice = this.getNumber('costPriceInp');
    if(costPrice > 0){
      let pricelist1 = (costPrice * 1.29);
      let pricelist2 = (costPrice * 1.35);
      let pricelist3 = (costPrice * 1.5);
      let pricelist4 = (costPrice * 1.7);
      let pricelistE = (costPrice * 1.16);
      let pricelistG = (costPrice * 1.22);
  
      let pricesAux: PriceXproduct = new PriceXproduct(this.pricesID, optionID, pricelist1, pricelist2, pricelist3, pricelist4, pricelistE, pricelistG, costPrice);
      return pricesAux;
    }else{
      alert('el costo no puede ser 0 o menor');
      return null;
    }
  }else{
    this.pricesID = this.productList.id;
    let costPrice = this.getNumber('modifyCostPriceInp');
    if(costPrice > 0){
      let pricelist1 = (costPrice * 1.29);
      let pricelist2 = (costPrice * 1.35);
      let pricelist3 = (costPrice * 1.5);
      let pricelist4 = (costPrice * 1.7);
      let pricelistE = (costPrice * 1.16);
      let pricelistG = (costPrice * 1.22);
      let pricesAux: PriceXproduct = new PriceXproduct(this.pricesID, optionID, pricelist1, pricelist2, pricelist3, pricelist4, pricelistE, pricelistG, costPrice);
      return pricesAux;
    }else{
      alert('el costo no puede ser 0 o menor');
      return null;
    }
  }
}

  addNewProduct(){ //La funcion solo sirve para cuando se va a agregar un nuevo producto, NO sirve para MODIFICAR
    let productAux: Product | null = this.getItemsProduct();
    if(productAux != null){
      this.productService.saveProduct(productAux).subscribe(() => {});
      this.added = true; //Al estar en verdadero se activara el mensaje de producto cargado}
    }
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
    let productAux: Product | null = this.getItemsProduct(); //Se crea un nuevo producto y se le asignan los input a travez de esa funcion
    if(productAux != null){
      this.productService.updateProduct(this.productID, productAux).subscribe(()=>{});
      this.toModify = false; //Despues de modificar todo, el a modificar queda en falso, ya que ya modificó lo que quiso y lo guardó
      this.modified = true; //Despues de modificar todo, el modificado queda en verdadero, para que el html detecte esto y ponga el mensaje de modificacion correcta
      this.enableOrDisableInputs(); //Se vuelve a cambiar la habilitacion de los inputs del producto, en este caso se van a deshabilitar nuevamente
    }
  }

  async readProduct(){ //Lee el producto que se trae POR PARAMETRO unicamente si lo que se desea es MODIFICAR
    let productAux = await this.getProduct();
    if(productAux){
      this.modifyProduct = productAux; //El modify product queda asignado como el producto a modificar, todos los datos del producto tomado por parametro son los datos que van a quedar en esta variable
      this.brand = this.modifyProduct.brand;
      this.onModifyBrands();
      return true; //Si el producto existe retorna verdadero para saber que se va a modificar algo existente
    }else{
      return false; //Si el producto no existe retorna falso y no deja modificar, solo agregar
    }
  }

  onModifyBrands(){
    let i = 0;
      let access = false;
      while(i<this.brands.length && !access){
        if(this.brands[i].name == this.brand){
          access = true;
        }else{
          i++;
        }
      }
      if(access){
        let brandAux = this.brands[i];
        this.brands.splice(i, 1);
        this.brands.unshift(brandAux);
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

        case "description": 
        return this.modifyProduct.description;

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

        case "costPrice": 
        return this.productList.costPrice;
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

  async getAllPrices(){
    for(let i = 0; i<this.options.length; i++){
      this.options[i].name = decodeURIComponent(this.options[i].name);
      let priceAux = await this.getPrice(this.options[i].id);
      let optionPrice: PriceXproduct;
      if(priceAux){
        optionPrice = priceAux;
        this.allPrices.push(optionPrice);
      }
    }
  }

  returnPrice(optionID: string){
    let optionPrice: PriceXproduct = new PriceXproduct('','',0,0,0,0,0,0,0);
    for(let i = 0; i<this.allPrices.length; i++){
      if(this.allPrices[i].optionID == optionID){
        return this.allPrices[i];
      }
    }
    return optionPrice;
  }

  async setProductPrice(orderID: string, priceList: number){
    let data = await this.getPrice(orderID);
    let priceAux: PriceXproduct = new PriceXproduct('','',0, 0,0,0,0,0,0);
    if(data != undefined){
      priceAux = data;
    }
    switch(priceList){
      case 1:
        return priceAux.priceList1;
      case 2:
        return priceAux.priceList2;
      case 3:
        return priceAux.priceList3;
      case 4:
          return priceAux.priceList4;
      default:
        return priceAux.priceList1;
    }
  }

  modifyFeatures(feature: Feature, index: number){
    if(this.features.length > 0){
      if(feature != undefined && feature != null){
        this.featureModify = true;
        this.enableOrDisableFeatures(feature.name, feature.value);
        let featureName = this.getString(feature.name);
        let featureValue = this.getString(feature.value);
        if(featureName.length > 0 && featureValue.length > 0){
          feature.name = featureName;
          feature.value = featureValue;
          this.featureService.updateOneFeature(index, feature);
          this.featureModify = false;
        }else{
          alert('No podes dejar ningun campo vacío');
        }
      }else{
        alert('Seleccione una caracteristica primero');
      }
    } else{
      alert('No hay caracteristicas para modificar')
    }
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
    if(this.productID.length > 0){
        if(featureName.length > 0 && featureValue.length > 0){
        let featureAux = new Feature(this.generateRandomId(16), featureName, featureValue, this.productID);
        this.featureService.createFeature(featureAux);
      }else{
        alert('No podes dejar ningun campo vacío');
      }
    }else{
        alert('Para agregar una caracteristica primero debe completar la carga de un producto');
        window.scrollTo(0, 0);
      }
  }
  messageUpdated(){
    if(localStorage.getItem('updated')){
      localStorage.removeItem('updated');
      return true;
    }else{
      return false;
    }
  }
  async modifyOptions(optionAux: Options, index: number){
    if(this.options.length > 0){
    let optionName = this.getString(optionAux.id);
      if(optionName.length > 0){
        optionAux.name = optionName;
        let pricesAux: PriceXproduct | null = this.getItemsPrice(optionAux.id, 'update'); //Mismo paso que el anterior pero con las listas de precios
        if(pricesAux != null){
          await this.pricesService.updateProduct(pricesAux.id, pricesAux).toPromise(); 
          this.optionService.updateOneOption(index, optionAux);
          localStorage.setItem('updated', JSON.stringify(true));
          location.reload();
        }
      }else{
        alert('No podes dejar el campo de nombre de opción vacío');
      }
    }else{
      alert('No hay opciones para modificar');
    }
  }
  addOption(){
    let optionName = this.getString('optionInp');
    let optionStock = this.getNumber('stockInp');
    if(optionName.length > 0){
      let optionAux = new Options(this.generateRandomId(16), optionName, this.productID, optionStock);
      let pricesAux: PriceXproduct | null = this.getItemsPrice(optionAux.id, 'add');
      if(pricesAux != null){
        this.optionService.createOption(optionAux);
        this.pricesService.saveProduct(pricesAux).subscribe(() => {});
      }
    }else{
      alert('No podes dejar el campo de nombre de opción vacío');
    }
  }
  searchOptionByName(nameAux: string){
    let i = 0;
    let access = false;

    while(i<this.options.length && !access){
      if(this.options[i].name == nameAux){
        access = true;
      }else{
        i++;
      }
    }
    if(access){
      return this.options[i];
    }else{
      return this.optionSelected;
    }
  }
  deleteOption(optionSelected: Options){
    if(this.options.length > 0){
      if(optionSelected.id != undefined){
      this.optionService.deleteOneOption(optionSelected.id);
      }
    }else{
      alert('No hay opciones para eliminar');
    }
  }
  selectOption(nameAux: string){
    this.optionSelected = this.searchOptionByName(nameAux);
    this.productList = this.returnPrice(this.optionSelected.id);
    this.optionTerm = this.optionSelected.name;
    this.optionsSearched = [];
  }
  changeBrand(event: Event){
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.brand = selectedValue;
  }

  updateSearchResults(){
    this.optionsSearched = [];
    if(this.optionTerm != ""){
      for(let i = 0; i<this.options.length; i++){
        if(this.options[i].name.includes(this.optionTerm)){
          this.optionsSearched.push(this.options[i]);
        }
      }
    }else{
      this.optionsSearched = [];
    }
    this.optionTerm = this.optionSelected.name;
  }

  async changePrices(option: string){
    let inpAux = document.getElementById('percentageInp') as HTMLInputElement;
    if(inpAux){
      let percentage = parseFloat(inpAux.value);
      if(inpAux.value.length > 0){
        if(percentage > 0){
          let confirmed = confirm('Cambiar los precios en ' + percentage + '% ?');
          if(confirmed){
            await this.modifyPrices(percentage, option);
          }
        }else{
          alert('El porcentaje de cambio no puede ser negativo o 0');
        }
      }else{
        alert('No podes dejar el campo vacio');
      }
    }else{
      alert('No podes dejar el campo vacio');
    }
  }

  async modifyPrices(percentage: number, option: string){
    for(let i=0; i<this.allPrices.length; i++){
      if(option == 'increase'){
        
        this.allPrices[i].costPrice = this.allPrices[i].costPrice + (this.allPrices[i].costPrice * percentage);
        this.allPrices[i].priceList1 = (this.allPrices[i].costPrice * 1.29);
        this.allPrices[i].priceList2 = (this.allPrices[i].costPrice * 1.35);
        this.allPrices[i].priceList3 = (this.allPrices[i].costPrice * 1.50);
        this.allPrices[i].priceList4 = (this.allPrices[i].costPrice * 1.70);
        this.allPrices[i].priceListE = (this.allPrices[i].costPrice * 1.16);
        this.allPrices[i].priceListG = (this.allPrices[i].costPrice * 1.22);

      }else if(option == 'decrease'){
        this.allPrices[i].costPrice = (this.allPrices[i].costPrice - (this.allPrices[i].costPrice * percentage));  
        this.allPrices[i].priceList1 = (this.allPrices[i].costPrice * 1.29);
        this.allPrices[i].priceList2 = (this.allPrices[i].costPrice * 1.35);
        this.allPrices[i].priceList3 = (this.allPrices[i].costPrice * 1.50);
        this.allPrices[i].priceList4 = (this.allPrices[i].costPrice * 1.70);
        this.allPrices[i].priceListE = (this.allPrices[i].costPrice * 1.16);
        this.allPrices[i].priceListG = (this.allPrices[i].costPrice * 1.22);
      }
      await this.pricesService.updateProduct(this.allPrices[i].id, this.allPrices[i]).toPromise();
    }
  }
}
