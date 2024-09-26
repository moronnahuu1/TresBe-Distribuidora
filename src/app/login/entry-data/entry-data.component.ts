import { Component, Inject, OnInit, inject } from '@angular/core';
import { User } from 'src/app/models/User';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-entry-data',
  templateUrl: './entry-data.component.html',
  styleUrls: ['./entry-data.component.css']
})
export class EntryDataComponent{
  userService = inject(UserService);
  incorrectEmail: boolean = false;
  incorrectPassword: boolean = false;
  users: Array<User> = [];
async validateUser(){
  /* Funcion principal que se va a utilizar cuando el usuario hace click en login. Reune a todas las demas funciones necesarias para
  validar que el ingreso del usuario al sistema sea el correcto, de no ser correcto informará al usuario cual es el error. */
  let emailInp = document.getElementById("emailInp") as HTMLInputElement; //Se lee el email ingresado
  let passwordInp = document.getElementById("passwordInp") as HTMLInputElement; //Se lee la contraseña ingresada
  let email = '';
  let password = '';
  if(emailInp && passwordInp){ //Se verifica que tanto el email como la contraseña ingresadas por los inputs tengan algun valor
    email = emailInp.value; //Se le asigna a la variable email el input de email ingresado
    password = passwordInp.value; //Se le asigna a la variable password el input de password ingresado
    /*let access = await this.userService.readTempLogin(email, password);
    if(access != null){
        localStorage.setItem('userLogged', JSON.stringify(access));
        if(access.email == "nahuelarielmoron1@gmail.com"){
          localStorage.setItem('admin', JSON.stringify(true));
        }
        window.location.href = '';
    }*/
    let access = await this.userService.readLogin(email,password);
    if(access){
      window.location.href = ''; //Se redirecciona al menu de inicio, con el usuario ya logueado
    }
}
}
}
