export class PublicUser{
    id: string;
    email: string;
    username: string;
    priceList: string;
    client: boolean;
    constructor(id: string, email: string, username: string, priceList: string, client: boolean){
        this.id = id;
        this.email = email;
        this.username = username;
        this.priceList = priceList; //Para saber que lista de precios va a tener el usuario
        this.client = client;
    }
}