import { Component, Inject, OnInit, inject } from '@angular/core';
import { User } from 'src/app/models/User';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-entry-data',
  templateUrl: './entry-data.component.html',
  styleUrls: ['./entry-data.component.css']
})
export class EntryDataComponent implements OnInit{
  userService = inject(UserService);
  incorrectEmail: boolean = false;
  incorrectPassword: boolean = false;
  users: Array<User> = [];
  async ngOnInit(): Promise<void> {
      ///await this.readUsers();
  }
  async readUsers(): Promise<void> {
    /* La funcion se encarga de llamar al getUsers y asignarle a la variable global 'users' todos los usuarios de la base de datos */
    const usersAux = await this.getUsers();
    if(usersAux != undefined){
      for(let i=0; i<usersAux.length; i++){
        this.users.push(usersAux[i]);
      }
    }
}
async getUsers(): Promise<User[] | undefined>{
  /* La funcion se encarga de leer todos los usuarios EN LA BASE DE DATOS y retornarlos para luego asignarlos a una variable global del componente */
  try {
    const data = await this.userService.getUsers().toPromise();
    console.log(data?.length);
    return data;
  } catch (error) {
    console.error('Error obteniendo datos:', error);
    throw error; // Puedes manejar el error de acuerdo a tus necesidades
  }
}
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
    let access = await this.userService.readTempLogin(email, password);
    if(access != null){
        localStorage.setItem('userLogged', JSON.stringify(access));
        if(access.email == "nahuelarielmoron1@gmail.com"){
          localStorage.setItem('admin', JSON.stringify(true));
        }
        window.location.href = '';
    }
    /*let access = await this.userService.readLogin(email,password);
    if(access){
      window.location.href = ''; //Se redirecciona al menu de inicio, con el usuario ya logueado
    }*/
}
}
}
