import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainMenuComponent } from './main-menu/main-menu.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { FooterComponent } from './footer/footer.component';
import { SwiperComponent } from './main-menu/swiper/swiper.component';
import { ProductsComponent } from './main-menu/products/products.component';
import { BranchesComponent } from './main-menu/branches/branches.component';
import { HttpClientModule } from '@angular/common/http';
import { ProductsListComponent } from './products-list/products-list.component';
import { ProductItemComponent } from './products-list/product-item/product-item.component';
import { CategoriesComponent } from './categories/categories.component';
import { CategoryItemComponent } from './categories/category-item/category-item.component';
import { CartComponent } from './cart/cart.component';
import { LoginComponent } from './login/login.component';
import { EntryDataComponent } from './login/entry-data/entry-data.component';
import { AddProductsComponent } from './add-products/add-products.component';
import { UserOptionsComponent } from './login/user-options/user-options.component';
import { CartListComponent } from './cart/cart-list/cart-list.component';
import { CheckoutOptionsComponent } from './cart/cart-list/checkout-options/checkout-options.component';
import { CheckoutButtonsComponent } from './cart/cart-list/checkout-options/checkout-buttons/checkout-buttons.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { ShipmentComponent } from './checkout/shipment/shipment.component';
import { UserDataComponent } from './checkout/user-data/user-data.component';
import { PayComponent } from './checkout/user-data/pay/pay.component';
import { OrderPlacedComponent } from './order-placed/order-placed.component';

@NgModule({
  declarations: [
    AppComponent,
    MainMenuComponent,
    NavBarComponent,
    FooterComponent,
    SwiperComponent,
    ProductsComponent,
    BranchesComponent,
    ProductsListComponent,
    ProductItemComponent,
    CategoriesComponent,
    CategoryItemComponent,
    CartComponent,
    LoginComponent,
    EntryDataComponent,
    AddProductsComponent,
    UserOptionsComponent,
    CartListComponent,
    CheckoutOptionsComponent,
    CheckoutButtonsComponent,
    CheckoutComponent,
    ShipmentComponent,
    UserDataComponent,
    PayComponent,
    OrderPlacedComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule { }
