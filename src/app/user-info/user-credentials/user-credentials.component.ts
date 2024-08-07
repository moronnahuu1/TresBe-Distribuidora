import { Component, OnInit, inject } from '@angular/core';
import { UserDisplayService } from 'src/app/services/user-display.service';

@Component({
  selector: 'app-user-credentials',
  templateUrl: './user-credentials.component.html',
  styleUrls: ['./user-credentials.component.css']
})
export class UserCredentialsComponent implements OnInit{
  displayService = inject(UserDisplayService);
  displayed: string = '';
  async ngOnInit() {
    this.displayService._displayed.subscribe(data => {
      this.displayed = data;
    });
    this.getParameters();
  }
  getParameters(){
    if(localStorage.getItem('userOrders')){
      this.displayService.changeDisplay("myOrders");
      localStorage.removeItem("userOrders");
      return true;
    }else{
      return false;
    }
  }
  isAdmin(){
    if(localStorage.getItem('admin')){
      return true;
    }else{
      return false;
    }
  }
}
