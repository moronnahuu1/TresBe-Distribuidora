import { Component, OnInit, inject } from '@angular/core';
import { UserDisplayService } from 'src/app/services/user-display.service';

@Component({
  selector: 'app-options-user',
  templateUrl: './options-user.component.html',
  styleUrls: ['./options-user.component.css']
})
export class OptionsUserComponent{
  displayService = inject(UserDisplayService);
  displayed = this.displayService.displayed;

  displaySubmenu: boolean = false;
  displayCoupon: boolean = false;

toggleSubmenu(type: string) {
  if(type == 'user'){
    if(this.displaySubmenu){
      this.displaySubmenu = false;
    }else{
      this.displaySubmenu = true;
    }
  }else if(type == 'coupon'){
    if(this.displayCoupon){
      this.displayCoupon = false;
    }else{
      this.displayCoupon = true;
    }
  }
}


  changeDisplay(name: string){
    this.displayService.changeDisplay(name);
    window.scrollTo(0,0);
  }

  isAdmin(){
    if(localStorage.getItem('admin')){
      return true;
    }else{
      return false;
    }
  }
}
