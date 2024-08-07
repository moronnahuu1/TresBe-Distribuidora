import { Component, inject, OnInit } from '@angular/core';
import { User } from 'src/app/models/User';
import { Userdata } from 'src/app/models/Userdata';
import { OrdersService } from 'src/app/services/orders.service';
import { UserDisplayService } from 'src/app/services/user-display.service';
import { UserdataService } from 'src/app/services/userdata.service';

@Component({
  selector: 'app-user-account',
  templateUrl: './user-account.component.html',
  styleUrls: ['./user-account.component.css']
})
export class UserAccountComponent implements OnInit{
  displayService = inject(UserDisplayService);
  userdataService = inject(UserdataService);
  displayed = this.displayService.displayed;
  user: User = new User('','','','','');
  userdata: Userdata = new Userdata('','','','','','','','','','',0,'','');
  orderService = inject(OrdersService);

  async ngOnInit() {
      this.orderService.returnUser().subscribe(user => {
        this.user = user;
      });
      (await this.userdataService.returnUserdata(this.user.id)).subscribe(userdata => {
        this.userdata = userdata;
      });
  }

  changeDisplay(name: string){
    this.displayService.changeDisplay(name);
  }
  isAdmin(){
    if(localStorage.getItem('admin')){
      return true;
    }else{
      return false;
    }
  }
}
