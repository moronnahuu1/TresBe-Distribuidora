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
