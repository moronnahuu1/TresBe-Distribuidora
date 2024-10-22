export class PublicUser{
    id: string;
    email: string;
    username: string;
    priceList: string;
    client: boolean;
    seller: string;
    constructor(id: string, email: string, username: string, priceList: string, client: boolean, seller: string){
        this.id = id;
        this.email = email;
        this.username = username;
        this.priceList = priceList; //Para saber que lista de precios va a tener el usuario
        this.client = client;
        this.seller = seller;
    }
}