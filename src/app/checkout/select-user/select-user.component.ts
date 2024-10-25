import { Component, inject, OnInit } from '@angular/core';
import { PublicUser } from 'src/app/models/PublicUser';
import { CookieService } from 'src/app/services/cookie.service';
import { UserService } from 'src/app/services/user.service';
import { UserdataService } from 'src/app/services/userdata.service';

@Component({
  selector: 'app-select-user',
  templateUrl: './select-user.component.html',
  styleUrls: ['./select-user.component.css']
})
export class SelectUserComponent implements OnInit {
  userService = inject(UserService);
  cookieService = inject(CookieService);
  userdataService = inject(UserdataService);
  users: PublicUser[] = [];
  user: PublicUser = new PublicUser('', '', '', '', false, '');
  admin: PublicUser = new PublicUser('', '', '', '', false, '');
  userSelected: PublicUser = new PublicUser('', '', '', '', false, '');
  userID: string = '';
  select: string = "Seleccione una opcion";
  async ngOnInit() {
    (await this.cookieService.getUser()).subscribe(data => {
      this.user = data;
    });
    (await this.cookieService.getAdmin()).subscribe(data => {
      this.admin = data;
    });
    if (this.isAdmin()) {
      this.users = await this.userService.readUsersBySeller(this.admin.username);
      this.users.unshift(this.user);
      this.userSelected = this.user;
      localStorage.setItem("userSelected", JSON.stringify(this.userSelected));
    }
  }
  isAdmin() {
    if (this.admin.email != '') {
      return true;
    } else {
      return false;
    }
  }
  async selectUser(event: Event) {
    if (this.isAdmin()) {
      localStorage.removeItem('userSelected');
      const selectedValue = (event.target as HTMLSelectElement).value;
      this.userID = selectedValue;
      this.userSelected = await this.userService.readUser(this.userID);
      (await this.userdataService.returnUserdata(this.userSelected.id)).subscribe(() => { });
      localStorage.setItem("userSelected", JSON.stringify(this.userSelected));
    }
  }
}
