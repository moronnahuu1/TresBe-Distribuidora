import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // Importar FormsModule

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
import { MessageSuccessComponent } from './order-placed/message-success/message-success.component';
import { OrderButtonsComponent } from './order-placed/order-buttons/order-buttons.component';
import { OrderProgressComponent } from './order-progress/order-progress.component';
import { HasOrderComponent } from './has-order/has-order.component';
import { MessageErrorComponent } from './has-order/message-error/message-error.component';
import { OrderDetailComponent } from './order-placed/order-detail/order-detail.component';
import { ButtonsDetailComponent } from './order-placed/order-detail/buttons-detail/buttons-detail.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { RegisterDataComponent } from './sign-up/register-data/register-data.component';
import { SendVoucherComponent } from './order-placed/send-voucher/send-voucher.component';
import { InfoSentComponent } from './order-placed/send-voucher/info-sent/info-sent.component';
import { UserInfoComponent } from './user-info/user-info.component';
import { BrandsComponent } from './brands/brands.component';
import { BrandInfoComponent } from './brands/brand-info/brand-info.component';
import { BrandsDataComponent } from './brands/brands-data/brands-data.component';
import { UserCredentialsComponent } from './user-info/user-credentials/user-credentials.component';
import { OptionsUserComponent } from './user-info/user-credentials/options-user/options-user.component';
import { MyAccountComponent } from './user-info/user-credentials/my-account/my-account.component';
import { MyBoughtsComponent } from './user-info/user-credentials/my-boughts/my-boughts.component';
import { PrivacityComponent } from './user-info/user-credentials/privacity/privacity.component';
import { ShipmentDataComponent } from './user-info/user-credentials/shipment-data/shipment-data.component';
import { TechSupportComponent } from './user-info/user-credentials/tech-support/tech-support.component';
import { ShipmentInformationComponent } from './sign-up/shipment-information/shipment-information.component';
import { UserDetailsComponent } from './user-info/user-credentials/my-account/user-details/user-details.component';
import { PosterInfoComponent } from './poster-info/poster-info.component';
import { SelectBrandComponent } from './poster-info/select-brand/select-brand.component';
import { SearchBarComponent } from './poster-info/search-bar/search-bar.component';
import { OrdersInfoComponent } from './user-info/user-credentials/orders-info/orders-info.component';

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
    MessageSuccessComponent,
    OrderButtonsComponent,
    OrderProgressComponent,
    HasOrderComponent,
    MessageErrorComponent,
    OrderDetailComponent,
    ButtonsDetailComponent,
    SignUpComponent,
    RegisterDataComponent,
    SendVoucherComponent,
    InfoSentComponent,
    UserInfoComponent,
    BrandsComponent,
    BrandInfoComponent,
    BrandsDataComponent,
    UserCredentialsComponent,
    OptionsUserComponent,
    MyAccountComponent,
    MyBoughtsComponent,
    PrivacityComponent,
    ShipmentDataComponent,
    TechSupportComponent,
    ShipmentInformationComponent,
    UserDetailsComponent,
    PosterInfoComponent,
    SelectBrandComponent,
    SearchBarComponent,
    OrdersInfoComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule, // Asegúrate de incluir FormsModule en los imports
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule { }
