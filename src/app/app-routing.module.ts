import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainMenuComponent } from './main-menu/main-menu.component';
import { ProductsComponent } from './main-menu/products/products.component';
import { ProductItemComponent } from './products-list/product-item/product-item.component';
import { ProductsListComponent } from './products-list/products-list.component';
import { CategoriesComponent } from './categories/categories.component';
import { CartComponent } from './cart/cart.component';
import { LoginComponent } from './login/login.component';
import { AddProductsComponent } from './add-products/add-products.component';
import { loginGuard } from './guards/login.guard';
import { loggedGuard } from './guards/logged.guard';
import { adminGuard } from './guards/admin.guard';
import { CheckoutComponent } from './checkout/checkout.component';
import { checkoutGuard } from './guards/checkout.guard';
import { OrderPlacedComponent } from './order-placed/order-placed.component';

const routes: Routes = [
  {
    path: '',
    component: MainMenuComponent
  },
  {
    path: 'products',
    component: ProductsListComponent
  },
  {
    path: 'products/:id',
    component: ProductItemComponent
  },
  {
    path: 'categories',
    component: CategoriesComponent
  },
  {
    path: 'categories/:category',
    component: ProductsListComponent
  },
  {
    path: 'cart',
    component: CartComponent
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [loggedGuard]
  },
  {
    path: 'add/product',
    component: AddProductsComponent,
    canActivate: [adminGuard]
  },
  {
    path: 'checkout',
    component: CheckoutComponent,
    canActivate: [checkoutGuard]
  },
  {
    path: 'placed',
    component: OrderPlacedComponent
  }
]
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { 
}
