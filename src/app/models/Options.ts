export class Options{
    id: string;
    name: string;
    value: string;
    productID: string;

    constructor(id: string, name: string, value: string, productID: string){
        this.id = id;
        this.name = name;
        this.value = value;
        this.productID = productID;
    }
}