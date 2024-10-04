import { Component, OnInit, inject } from '@angular/core';
import { City } from 'src/app/models/City';
import { Province } from 'src/app/models/Province';
import { PublicUser } from 'src/app/models/PublicUser';
import { User } from 'src/app/models/User';
import { Userdata } from 'src/app/models/Userdata';
import { cityJSON } from 'src/app/models/cityJSON';
import { ProvinceJSON } from 'src/app/models/provinceJSON';
import { CityService } from 'src/app/services/city.service';
import { CookieService } from 'src/app/services/cookie.service';
import { ProvinceService } from 'src/app/services/province.service';
import { UserdataService } from 'src/app/services/userdata.service';

@Component({
  selector: 'app-shipment',
  templateUrl: './shipment.component.html',
  styleUrls: ['./shipment.component.css']
})
export class ShipmentComponent implements OnInit{
  city: string = "Mar Del Plata";
  province: string = "Buenos Aires";
  Country: string = "Argentina";
  dataCreated: boolean = false;
  userdataService = inject(UserdataService);
  userID: string = "";
  user: PublicUser = new PublicUser("", "", "", "",false);
  users: Array<Userdata> = [];
  userdata: Userdata = new Userdata("", "", "", "", "", "", "", "", "", "", 0, "", "false");
  saveData: boolean = false;
  cityService = inject(CityService);
  cityJSON: cityJSON = new cityJSON(0, []);
  cities: Array<City> = [];
  allCities: Array<City> = [];
  ProvinceService = inject(ProvinceService);
  provinceJSON: ProvinceJSON = new ProvinceJSON(0,0,[],[],0);
  provinces: Array<Province> = [];
  provinciaSeleccionada: string | null = null; // Inicializar como null o un valor adecuado
  searchTerm: string = '';
  isLogged: boolean = false;
  cookieService = inject(CookieService);

  async ngOnInit() {
    (await this.cookieService.getUser()).subscribe(data => {
      this.user = data;
    });
    const usersAux = await this.getUserData();
    if(usersAux != undefined){
      for(let i=0; i<usersAux.length; i++){
        this.users.push(usersAux[i]);
      }
    }
      this.getUserdataInfo();
      if(this.userdata.email != ''){
        this.userID = this.userdata.id;
        this.dataCreated = true;
        localStorage.setItem("dataCreated", JSON.stringify(true));
        this.enableOrDisableInputs();
        this.verifyChecked();
      }

      this.ProvinceService.getProvinces().subscribe(data => {
        this.provinceJSON = data;
        this.provinces = this.provinceJSON.provincias;  
    });

    if(this.userdata.email != ""){
    }else{
      this.provinciaSeleccionada = "Ciudad Autónoma de Buenos Aires";
    }

    if(this.getValue("saveIt") == "true"){
      this.saveData = true;
    }else{
      this.saveData = false;
    }
  }

  updateSearchResults(): void {
    if(this.searchTerm != ""){
      this.cityService.getCities(this.provinciaSeleccionada, this.searchTerm).subscribe(data => {
        this.cityJSON = data;      
        console.log(this.cityJSON);
        this.cities = this.cityJSON.localidades;
    });
    }else{
      this.cities = [];
    }
  }

  onProvinceChange(){
    this.cities = [];
    this.searchTerm = "";
  }

  selectOption(option: string): void {
    this.searchTerm = option; // Establece el valor del input al seleccionar una opción
    this.cities = [];
  }

  verifyChecked(){
    const toggleButton = document.getElementById("toggleButton");
    if(toggleButton){
      const isChecked = this.userdata.saveIt;
      if(isChecked == "true"){
        toggleButton.setAttribute("data-checked", "true");
      }else{
        toggleButton.setAttribute("data-checked", "false");
      }
    }
  }

  getUserdataInfo(){
    let i = 0;
    let access: boolean = false;
    while(i<this.users.length && !access){
      if(this.user.id == this.users[i].userID){
        access = true;
      }else{
        i++;
      }
    }
    if(access){
      this.userdata = this.users[i];
    }
  }

  checkButton(){
    const toggleButton = document.getElementById("toggleButton");
    if(toggleButton){
      const isChecked = toggleButton.getAttribute("data-checked") === "true";
      if (isChecked) {
        toggleButton.setAttribute("data-checked", "false");
        this.saveData = false;
      } else {
        toggleButton.setAttribute("data-checked", "true");
        this.saveData = true;
      }
    }
  }

  enableOrDisableInputs(){
    const shipmentInputs = document.querySelectorAll('.shipmentInput');
    shipmentInputs.forEach(input => {
      if(this.dataCreated){
        input.setAttribute('disabled', 'disabled');
      }else{
        input.removeAttribute('disabled');
      }
    })
  }

  getValue(name: string){
    if(name != "" && this.userdata != undefined){
      switch(name){
        case "firstname": 
        return this.userdata.firstname;

        case "lastname": 
        return this.userdata.lastname

        case "company": 
        return this.userdata.company;

        case "phone": 
        return this.userdata.phone;

        case "email": 
        return this.userdata.email;

        case "street": 
        return this.userdata.street;

        case "streetNumb": 
        return this.userdata.streetNumb;

        case "city": 
        return this.userdata.city;

        case "province": 
        return this.userdata.province;

        case "saveIt": 
        return this.userdata.saveIt;
      }
      return "";
    }else{
      return "";
    }
  }

  getString(name: string){
    let inpAux = document.getElementById(name) as HTMLInputElement;
    let input: string = "";
    if(inpAux){
      input = inpAux.value;
    }
    return input;
  }
  getNumber(name: string){
    let inpAux = document.getElementById(name) as HTMLInputElement;
    let input: number = 0;
    if(inpAux){
      input = parseInt(inpAux.value);
    }
    return input;
  }

  generateRandomId(length: number = 16): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}

  createUserData(){
    let id = this.generateRandomId(16);
    this.userID = id;
    let firstname = this.getString("firstNameInp");
    let lastname = this.getString("lastNameInp");
    let company = this.getString("companyInp");
    let phone = this.getString("phoneInp");
    let email = this.getString("emailInp");
    let address = this.getString("streetInp");
    let addressNumb = this.getNumber("streetNumInp");
    let city = this.getString("cityInp");
    let province = "";
    if(this.provinciaSeleccionada){
      province = this.provinciaSeleccionada;
    }
    let countryAux = "Argentina";
    let saveIt = "";
    if(this.saveData){
      saveIt = "true";
    }else{
      saveIt = "false";
    }
    const shipmentData: Userdata = new Userdata(id, firstname, lastname, company, phone, email, countryAux, province, city, address, addressNumb, this.user.id, saveIt);
    this.userdataService.saveUserdata(shipmentData).subscribe(() => {
    })
    this.dataCreated = true;
    this.enableOrDisableInputs();
    localStorage.setItem("dataCreated", JSON.stringify(true));
  }
  async deleteUserData(){
    const data = await this.userdataService.deleteUserdata(this.userID).toPromise();
    this.dataCreated = false;
    this.enableOrDisableInputs();
    localStorage.removeItem("dataCreated");
  }
  async getUserData(){
    try {
      const data = await this.userdataService.getUsersdata().toPromise();
      console.log(data?.length);
      return data;
    } catch (error) {
      console.error('Error obteniendo datos:', error);
      throw error; // Puedes manejar el error de acuerdo a tus necesidades
    }
  }
}
