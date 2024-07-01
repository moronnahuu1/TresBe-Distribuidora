export class User{
    id: string;
    email: string;
    password: string;
    username: string;
    priceList: number;

    constructor(id: string, email: string, password: string, username: string, priceList: number){
        this.id = id;
        this.email = email;
        this.password = password;
        this.username = username;
        this.priceList = priceList; //Para saber que lista de precios va a tener el usuario
    }
}