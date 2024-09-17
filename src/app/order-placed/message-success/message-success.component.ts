import { Component, inject, OnInit } from '@angular/core';
import { User } from 'src/app/models/User';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-message-success',
  templateUrl: './message-success.component.html',
  styleUrls: ['./message-success.component.css']
})
export class MessageSuccessComponent implements OnInit{
  user: User = new User('','','','','', '');
  userService = inject(UserService);

  ngOnInit(): void {
      this.user = this.userService.getUserLogged();
  }
}
