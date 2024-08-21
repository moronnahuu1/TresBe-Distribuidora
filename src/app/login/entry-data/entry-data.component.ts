import { Component, Inject, OnInit, inject } from '@angular/core';
import { User } from 'src/app/models/User';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment'

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
      await this.readUsers();
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
validateUser(){
  /* Funcion principal que se va a utilizar cuando el usuario hace click en login. Reune a todas las demas funciones necesarias para
  validar que el ingreso del usuario al sistema sea el correcto, de no ser correcto informará al usuario cual es el error. */
  let emailInp = document.getElementById("emailInp") as HTMLInputElement; //Se lee el email ingresado
  let passwordInp = document.getElementById("passwordInp") as HTMLInputElement; //Se lee la contraseña ingresada
  let email = '';
  let password = '';
  if(emailInp && passwordInp){ //Se verifica que tanto el email como la contraseña ingresadas por los inputs tengan algun valor
    email = emailInp.value; //Se le asigna a la variable email el input de email ingresado
    password = passwordInp.value; //Se le asigna a la variable password el input de password ingresado
    let userIndex = this.checkCredentials(email, password); //Se comprueban los datos ingresados, si coincide todo (email, pass) deberia retornar la posicion del arreglo en la que se encuentra el usuario
    if(userIndex == -1){ //Si el retorno del checking retorna -1 significa que no encontro el usuario, por tanto no hace ninguna modificacion en el sistema
    }else{ //Si el retorno devuelve un valor igual o mayor a 0 significa que encontro el usuario, por lo que entraria a esta seccion
      localStorage.setItem("userLogged", JSON.stringify(this.users[userIndex]));  //Se guarda en local storage una copia del usuario que se loguea, para saber que está logueado en cualquier parte de la pagina
      if(environment.admin){
        alert(environment.admin);
        if(this.users[userIndex].email == environment.admin/*"nahuelarielmoron1@gmail.com"*/){ //Comprobacion de administrador, si el mail coincide significa que se esta logueando un administrador
        localStorage.setItem("admin", JSON.stringify(true)); //Se guarda en local storage una comprobacion de admin, para saber en cualquier parte de la pagina que el usuario logueado es admin
      }
      }
      window.location.href = ''; //Se redirecciona al menu de inicio, con el usuario ya logueado
    }
  }
}
checkCredentials(email: string, password: string){
  let i = 0;
  let access = false;
  while(i<this.users.length && !access && !this.incorrectPassword){ //Se verifica que la variable incremental sea menor a la longitud del arreglo de usuarios y que aun no tenga acceso
    if(this.users[i].email == email){ //Se busca si el email de un usuario de la base de datos coincide con el email ingresado por el usuario en la pagina
      if(this.users[i].password == password){ //Si los mails coinciden, se hace la misma verificacion con la contraseña
        access = true; //Si la contraseña coincide, se le otorga el acceso
        this.incorrectPassword = false;
      }else{
        this.incorrectPassword = true; //Si no coincide la contraseña, se activa el dato de contraseña incorrecta para hacerle saber al usuario que su contraseña es incorrecta
      }
    }else{
      i++; //Si el email no coincide, se busca otro usuario
    }
  }
  if(this.incorrectPassword){ //Se verifica si la contraseña no coincide
    this.incorrectEmail = false;
    return -1;
  }else{ //Aca entra solo si la contraseña coincide
    if(access){ //Si todo coincide entra aca (email, pass)
      this.incorrectEmail = false;
      this.incorrectPassword = false;
      return i;
    }else{ //Si no tiene acceso pero la contraseña no es incorrecta o directamente no fue verificada es porque no coincide el email, y entra aca
      this.incorrectEmail = true;
      return -1;
    }
  }
}
}
