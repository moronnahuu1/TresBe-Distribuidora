import { Component, inject, OnInit } from '@angular/core';
import { User } from 'src/app/models/User';
import { UserDisplayService } from 'src/app/services/user-display.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-privacity',
  templateUrl: './privacity.component.html',
  styleUrls: ['./privacity.component.css']
})
export class PrivacityComponent implements OnInit{
  user: User = new User('', '', '','','');
  userService = inject(UserService);
  displayService = inject(UserDisplayService);
  ngOnInit(): void {
      this.user = this.userService.getUserLogged();
  }
  changeDisplay(name: string){
    this.displayService.changeDisplay(name);
  }
}
