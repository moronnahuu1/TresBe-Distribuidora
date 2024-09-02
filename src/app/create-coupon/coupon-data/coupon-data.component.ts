import { Component, inject } from '@angular/core';
import { Cupon } from 'src/app/models/Cupon';
import { CouponService } from 'src/app/services/coupon.service';

@Component({
  selector: 'app-coupon-data',
  templateUrl: './coupon-data.component.html',
  styleUrls: ['./coupon-data.component.css']
})
export class CouponDataComponent {
  couponService = inject(CouponService);
  saved: boolean = false;
  getString(name: string){
    let inpAux = document.getElementById(name) as HTMLInputElement;
    let input = "";
    if(inpAux){
      input = inpAux.value;
    }
    return input;
  }

  getDate(name: string){
    let inpAux = document.getElementById(name) as HTMLInputElement;
    let input = new Date();
    if(inpAux){
      input = new Date(inpAux.value);
    }
    return input;
  }

  getNumber(name: string){
    let inpAux = document.getElementById(name) as HTMLInputElement;
    let input = 0;
    if(inpAux){
      input = parseFloat(inpAux.value);
    }
    return input;
  }

  async createCoupon(){
    const coupon = this.generateNewCoupon();
    await this.couponService.saveCoupon(coupon).toPromise();
    this.saved = true;
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
  generateNewCoupon(){
    let id = this.generateRandomId(16);
    let code = this.getString('couponNameInp');
    let price = this.getNumber('couponPriceInp')
    let minimum = this.getNumber('couponMinInp')
    let expiration = this.getDate('couponExpInp');

    let newCoupon = new Cupon(id, code, price, expiration, false, minimum);

    return newCoupon;
  }
}
