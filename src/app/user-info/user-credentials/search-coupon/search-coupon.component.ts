import { Component, inject } from '@angular/core';
import { Cupon } from 'src/app/models/Cupon';
import { CouponService } from 'src/app/services/coupon.service';

@Component({
  selector: 'app-search-coupon',
  templateUrl: './search-coupon.component.html',
  styleUrls: ['./search-coupon.component.css']
})
export class SearchCouponComponent {
  notFound: boolean = false;
  couponService = inject(CouponService);
  couponSearched: Cupon = new Cupon('','',0,new Date(), false, 0);
  async searchCoupon(){
    let inpAux = document.getElementById('couponNameInp') as HTMLInputElement;
    if(inpAux){
      let input = inpAux.value;
      this.couponSearched = await this.couponService.searchCoupon(input);
      if(this.couponSearched.id != ''){
        window.location.href = `/coupons/${this.couponSearched.id}`;
      }else{
        this.notFound = true;
      }
    }
  }
}
