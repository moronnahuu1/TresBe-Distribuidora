import { Component, inject, OnInit } from '@angular/core';
import { User } from 'src/app/models/User';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-change-email',
  templateUrl: './change-email.component.html',
  styleUrls: ['./change-email.component.css']
})
export class ChangeEmailComponent implements OnInit{
  userService = inject(UserService);
  user: User = new User('','','','',0);
  updated: boolean = false;
  badEmail: boolean = false;
  ngOnInit(): void {
      this.user = this.userService.getUserLogged();
  }
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  changeEmail(){
    let inpAux = document.getElementById('newEmailInp') as HTMLInputElement;
    if(inpAux){
      let newMail = inpAux.value;
      if(newMail != ''){
        if(this.isValidEmail(newMail)){
          this.user.email = newMail;
          this.userService.updateUser(this.user.id, this.user).subscribe(()=>{});
          this.updated = true;
          this.badEmail = false;
        }else{
          this.updated = false;
          this.badEmail = true;
        }
      }else{
        this.updated = false;
        this.badEmail = false;
      }
    }
  }
}