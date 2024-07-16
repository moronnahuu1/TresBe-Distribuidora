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
  optionSelected = '';
  cartProducts: Array<Product> = [];
  productSelected: Product = new Product('','','','',0,'',0,'', 1);
  allFeatures: Feature[]= [];
  activeRoute = inject(ActivatedRoute);
  user: User = new User('', '', '', '', 0);
  onCart: Boolean = false;
  async ngOnInit(): Promise<void> {
    window.scrollTo(0,0); //Se pone la vista de la pantalla en la forma original, en la parte de arriba
    this.user = this.userService.getUserLogged() ///Se lee el usuario logueado
    const id = this.activeRoute.snapshot.params['id']; //Se busca mediante la ruta el ID del producto al que se quiere acceder
    this.productSelected = await this.productService.returnOneProduct(id); //Se busca el producto con el ID del parametro y se retorna desde la BDD
    this.productSelected.priceDiscount = (this.productSelected.price - (this.productSelected.price * this.productSelected.discount)); //Se calcula el descuento(Si es que tiene)
    (await this.featureService.readProductFeatures(this.productSelected.id)).subscribe(features => { //Se leen las caracteristicas asociadas que tiene el producto
      this.productSelected.features = features;
    });
    (await this.optionService.readProductOptions(this.productSelected.id)).subscribe(options => { //Se leen las opciones asignadas que tiene este producto
      this.options = options;
      if(options.length > 0){ //Se asigna al producto la primer opcion que se encuentra para que, en caso de no elegir opcion, tenga esa primera opcion como default
        this.optionSelected = options[0].name;
        this.productSelected.optionSelected = this.optionSelected;
      }
    });
    this.cartService.getProducts().subscribe(cartProducts => { //Se leen los productos del carrito, para saber si este producto que se esta viendo ya esta asignado al carrito o no
      this.cartProducts = cartProducts;
    });
    this.productSelected.price = await this.setProductPrice(this.productSelected.id);
    this.isOnCart();
  }
  addToCart(){ //Se invoca a esta funcion cuando el usuario clickea el boton de añadir al carrito
    this.productSelected.quantity = 1; //Se asigna cantidad 1 para evitar errores en la base de datos de tipo null y demas
    let productAux = this.productSelected;
    let productCart = this.isOnCart();
    productAux.optionSelected = this.optionSelected;
    if(productCart != null){ //Se verifica que este producto no este en el carrito. Si es distinto de NULL esta en el carrito
      this.cartService.addNewProduct(productAux); //se agrega el producto a la BDD
      this.onCart = true;
    }else{
      this.cartService.addNewProduct(productAux); //se agrega el producto a la BDD
      this.onCart = true;
    }

    if(this.options.length > 0){
      location.reload();
    }
  }
  formatNumber(number: number): string {
    return number.toLocaleString(); // Esto añadirá separadores de miles
  }
  getOptionSelected(){  //Se trae desde el html la opcion seleccionada
    let optionAux = document.getElementById('prodOptions') as HTMLSelectElement;
    if(optionAux){
      this.optionSelected = optionAux.value;
    }
  }
  isOnCart(){ //Verifica si el producto se encuentra o no se encuentra en el carrito
    this.getOptionSelected(); //Se busca la opcion seleccionada
    let cartAux = localStorage.getItem("cart"); //Se lee el carrito
    if(cartAux){ //Si hay un carrito
      let cart: Array<Product> = JSON.parse(cartAux); //Se asigna ese carrito a una variable de esta clase
      let i=0; //Para while
      let access = false; //Para while
      while(i<cart.length && !access){ //Mientras no se exceda la cantidad de elementos del carrito y no se consiga el acceso continuara iterando
        if(cart[i].id == this.productSelected.id){ //Si el producto del carrito tiene el mismo ID que el producto a agregar significa que el producto esta repetido
            this.onCart = true;
            return cart[i];
        }else{
          this.onCart = false;
          i++;
        }
      }
      return null; ///Se retorna verdadero o falso segun lo que se encuentre dentro del while
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
  async setProductPrice(productID: string){ //Funcion para asignarle al producto su lista de precios
    let data = await this.getPrice(productID); //Se lee la lista de precios desde la BDD con el ID del producto
    let priceAux: PriceXproduct = new PriceXproduct('','',0, 0,0,0);
    if(data != undefined){
      priceAux = data;
    }
    if(this.user.email == ''){ //Si el usuario está logueado de forma incorrecta, entra aca y asigna la lista de precios por defecto, en este caso la lista 1
      return priceAux.priceList1;
    }else{
      switch(this.user.priceList){ //Si el usuario esta logueado de forma correcta, entra al else y hace el switch, revisando la lista de precios que tiene el usuario
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
  }
  async getPrice(id: string){
    try {
      const data = await this.productXpriceService.getTableByProduct(id).toPromise();
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
}
