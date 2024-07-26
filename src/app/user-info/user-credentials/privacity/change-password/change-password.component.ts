import { Component, inject, OnInit } from '@angular/core';
import { User } from 'src/app/models/User';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit{
  userService = inject(UserService);
  user: User = new User('','','','',0);
  updated: boolean = false;
  badEmail: boolean = false;
  ngOnInit(): void {
      this.user = this.userService.getUserLogged();
  }
  changePass(){}
}
