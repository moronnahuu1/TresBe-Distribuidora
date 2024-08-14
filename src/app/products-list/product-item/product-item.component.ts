import { Component, OnInit, inject } from '@angular/core';
import { Product } from 'src/app/models/Product';
import { ProductService } from 'src/app/services/product.service';
import { ActivatedRoute } from '@angular/router';
import { Feature } from 'src/app/models/Feature';
import { FeatureService } from 'src/app/services/feature.service';
import { CartService } from 'src/app/services/cart.service';
import { PricesService } from 'src/app/services/prices.service';
import { PriceXproduct } from 'src/app/models/PriceXproduct';
import { User } from 'src/app/models/User';
import { OptionsService } from 'src/app/services/options.service';
import { Options } from 'src/app/models/Options';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.css']
})
export class ProductItemComponent implements OnInit{
  productService = inject(ProductService);
  userService = inject(UserService);
  productXpriceService = inject(PricesService);
  featureService = inject(FeatureService);
  cartService = inject(CartService);
  optionService = inject(OptionsService);
  options: Options[] = [];
  optionSelected: Options = new Options('','','');
  cartProducts: Array<Product> = [];
  productSelected: Product = new Product('','','','',0,'',0,'', 1, 0);
  allFeatures: Feature[]= [];
  activeRoute = inject(ActivatedRoute);
  user: User = new User('', '', '', '', '');
  onCart: Boolean = false;
  searchTerm: string = '';
  optionsSearched: Options[] = [];

  async ngOnInit(): Promise<void> {
    window.scrollTo(0,0); //Se pone la vista de la pantalla en la forma original, en la parte de arriba
    this.user = this.userService.getUserLogged() ///Se lee el usuario logueado
    const id = this.activeRoute.snapshot.params['id']; //Se busca mediante la ruta el ID del producto al que se quiere acceder
    this.productSelected = await this.productService.returnOneProduct(id); //Se busca el producto con el ID del parametro y se retorna desde la BDD

    (await this.optionService.readProductOptions(this.productSelected.id)).subscribe(options => { //Se leen las opciones asignadas que tiene este producto
      this.options = options;
      if(options.length > 0){ //Se asigna al producto la primer opcion que se encuentra para que, en caso de no elegir opcion, tenga esa primera opcion como default
        this.getSelected();
        this.productSelected.optionSelected = this.optionSelected.name;
      }
    });

    this.productSelected.priceDiscount = (this.productSelected.price - (this.productSelected.price * this.productSelected.discount)); //Se calcula el descuento(Si es que tiene)

    (await this.featureService.readProductFeatures(this.productSelected.id)).subscribe(features => { //Se leen las caracteristicas asociadas que tiene el producto
      this.productSelected.features = features;
    });

    this.cartService.getProducts().subscribe(cartProducts => { //Se leen los productos del carrito, para saber si este producto que se esta viendo ya esta asignado al carrito o no
      this.cartProducts = cartProducts;
    });
    this.isOnCart();
    this.options = this.sortDimensions(this.options);
  }
  getSelected(){
    let optionAux = localStorage.getItem('optionSelected');
    if(optionAux){
      this.optionSelected = JSON.parse(optionAux);
    }else{
      this.optionSelected = this.options[0];
    }
    localStorage.removeItem('optionSelected');
  }
  async addToCart(){ //Se invoca a esta funcion cuando el usuario clickea el boton de añadir al carrito
    this.productSelected.quantity = 1; //Se asigna cantidad 1 para evitar errores en la base de datos de tipo null y demas
    let productAux = this.productSelected;
    let productCart = await this.isOnCart();
    productAux.optionSelected = this.optionSelected.name;
    let latestID = productAux.id;
    productAux.id = this.generateRandomId(16);
    if(productCart != null){ //Se verifica que este producto no este en el carrito. Si es distinto de NULL esta en el carrito
      if(this.differentOption(productCart)){
        this.cartService.addNewProduct(productAux, latestID); //se agrega el producto a la BDD
        this.onCart = true;
      }else{
        this.onCart = false;
      }
    }else{
      this.cartService.addNewProduct(productAux, latestID); //se agrega el producto a la BDD
      this.onCart = true;
    }

    if(this.options.length > 0){
      localStorage.setItem('optionSelected', JSON.stringify(this.optionSelected));
      location.reload();
    }
  }
  differentOption(productAux: Product){
    if(productAux.optionSelected != this.optionSelected.name){
      return true;
    }else{
      return false;
    }
  }
  formatNumber(number: number): string {
    return number.toLocaleString(); // Esto añadirá separadores de miles
  }
  async getOptionSelected(){  //Se trae desde el html la opcion seleccionada
    let optionAux = this.optionSelected;
    if(optionAux){
      let optionInp = optionAux.name;
      let optionAux1 = await this.optionService.returnProductByName(this.optionSelected.id);
      if(optionAux1 != null){
        this.optionSelected = optionAux1;
        this.productSelected.price = await this.setProductPrice(this.optionSelected.id);
        this.productSelected.priceDiscount = (this.productSelected.price - (this.productSelected.price * this.productSelected.discount));
      }
    }
  }
  async isOnCart(){ //Verifica si el producto se encuentra o no se encuentra en el carrito
    await this.getOptionSelected(); //Se busca la opcion seleccionada
    let cartAux = localStorage.getItem("cart"); //Se lee el carrito
    if(cartAux){ //Si hay un carrito
      let cart: Array<Product> = JSON.parse(cartAux); //Se asigna ese carrito a una variable de esta clase
      let i=0; //Para while
      let access = false; //Para while
      while(i<cart.length && !access){ //Mientras no se exceda la cantidad de elementos del carrito y no se consiga el acceso continuara iterando
        if(cart[i].name == this.productSelected.name){ //Si el producto del carrito tiene el mismo ID que el producto a agregar significa que el producto esta repetido
          if(this.differentOption(cart[i])){
            this.onCart = false;
            i++;
          }else{
            this.onCart = true;
            access = true;
          }
        }else{
          this.onCart = false;
          i++;
        }
      }
      if(access){
        return cart[i];
      }else{
        return null; ///Se retorna verdadero o falso segun lo que se encuentre dentro del while
      }
    }else{
      this.onCart = false;
      return null;
    }
  }
  isAdmin(){
    let access = localStorage.getItem("admin");
    let admin = false;
    if(access){
      admin = JSON.parse(access);
    }
    return admin;
  }
  async setProductPrice(optionID: string){ //Funcion para asignarle al producto su lista de precios
    let data = await this.getPrice(optionID); //Se lee la lista de precios desde la BDD con el ID del producto
    let priceAux: PriceXproduct = new PriceXproduct('','',0, 0,0,0,0,0,0);
    if(data != undefined){
      priceAux = data;
    }
    if(this.user.email == ''){ //Si el usuario está logueado de forma incorrecta, entra aca y asigna la lista de precios por defecto, en este caso la lista 1
      return priceAux.priceList1;
    }else{
      switch(this.user.priceList){ //Si el usuario esta logueado de forma correcta, entra al else y hace el switch, revisando la lista de precios que tiene el usuario
        case '1':
          return priceAux.priceList1;
        case '2':
          return priceAux.priceList2;
        case '3':
          return priceAux.priceList3;
        case '4':
          return priceAux.priceList4;
        case 'E':
            return priceAux.priceListE;
        case 'G':
          return priceAux.priceListG;
        default:
          return priceAux.priceList1;
      }
    }
  }
  async getPrice(optionID: string){
    try {
      const data = await this.productXpriceService.getTableByProduct(optionID).toPromise();
      console.log(data);
      return data;
    } catch (error) {
      console.error('Error obteniendo datos:', error);
      throw error; // Puedes manejar el error de acuerdo a tus necesidades
    }
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

// dimension-sorter.ts
sortDimensions(dimensions: Options[]): Options[] {
  return dimensions.sort((a, b) => {
    const aParts = this.extractParts(a.name);
    const bParts = this.extractParts(b.name);

    const aTotal = aParts.whole + aParts.fraction;
    const bTotal = bParts.whole + bParts.fraction;

    return aTotal - bTotal;
  });
}


extractParts(value: string): { whole: number, fraction: number } {
  const parts = value.split(' ');
  let whole = 0;
  let fraction = 0;

  if (parts.length === 2) {
    whole = parseFloat(parts[0]);
    fraction = this.parseFraction(parts[1]);
  } else if (parts.length === 1) {
    if (parts[0].includes('/')) {
      fraction = this.parseFraction(parts[0]);
    } else {
      whole = parseFloat(parts[0]);
    }
  }

  if (isNaN(whole) || isNaN(fraction)) {
    throw new Error('Invalid parts numbers');
  }

  return { whole, fraction };
}


parseFraction(fraction: string): number {
  const parts = fraction.split('/');
  if (parts.length !== 2) {
    throw new Error('Invalid fraction format');
  }
  const numerator = parseFloat(parts[0]);
  const denominator = parseFloat(parts[1]);
  if (isNaN(numerator) || isNaN(denominator) || denominator === 0) {
    throw new Error('Invalid fraction numbers');
  }
  return numerator / denominator;
}



  /*// dimension-sorter.ts
  sortDimensions(dimensions: Options[]): Options[] {
    return dimensions.sort((a, b) => {
      // Extraer y convertir las partes de la dimensión para comparar
      const [numA, fracA] = this.extractParts(a.name);
      const [numB, fracB] = this.extractParts(b.name);
  
      // Comparar las partes numéricas
      if (numA !== numB) {
        return numA - numB;
      }
  
      // Comparar las partes fraccionarias
      return fracA - fracB;
    });
  }
  
  extractParts(dimension: string): [number, number] {
    // Extraer la parte antes de 'X' y convertirla a número
    const [part1, part2] = dimension.split('X').map(part => part.trim());
  
    const mainPart = parseFloat(part1);
  
    // Extraer la parte después de 'X' y convertirla a número decimal
    const fractionMatch = part2.match(/(\d+) (\d+)\/(\d+)/);
    let fractionPart = 0;
  
    if (fractionMatch) {
      const [whole, numerator, denominator] = fractionMatch.slice(1).map(Number);
      fractionPart = whole + (numerator / denominator);
    } else {
      fractionPart = parseFloat(part2);
    }
  
    return [mainPart, fractionPart];
  }*/

  updateSearchResults(){
    this.optionsSearched = [];
    if(this.searchTerm != ""){
      for(let i = 0; i<this.options.length; i++){
        if(this.options[i].name.includes(this.searchTerm)){
          this.optionsSearched.push(this.options[i]);
        }
      }
    }else{
      this.optionsSearched = [];
    }
  }

  async selectOption(optionAux: Options){
    if(optionAux){
      this.optionSelected = optionAux;
      this.optionsSearched = [];
    }
    await this.isOnCart();
  }

}
