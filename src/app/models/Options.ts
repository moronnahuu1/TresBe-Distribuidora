export class Options{
    id: string;
    name: string;
    productID: string;
    stock: number;

    constructor(id: string, name: string, productID: string, stock: number){
        this.id = id;
        this.name = name;
        this.productID = productID;
        this.stock = stock;
    }
}