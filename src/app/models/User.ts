export class User{
    id: string;
    email: string;
    password: string;
    username: string;
    priceList: string;
    client: boolean = false;
    seller: string;

    constructor(id: string, email: string, password: string, username: string, priceList: string, seller: string){
        this.id = id;
        this.email = email;
        this.password = password;
        this.username = username;
        this.priceList = priceList; //Para saber que lista de precios va a tener el usuario
        this.seller = seller;
    }
}