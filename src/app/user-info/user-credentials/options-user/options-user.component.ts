import { Component, OnInit, inject } from '@angular/core';
import { User } from 'src/app/models/User';
import { Userdata } from 'src/app/models/Userdata';
import { UserDisplayService } from 'src/app/services/user-display.service';
import { UserdataService } from 'src/app/services/userdata.service';

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
}
