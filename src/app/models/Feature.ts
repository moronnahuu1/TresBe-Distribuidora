export class Feature{
    id: string | undefined;
    product_id: string;
    name: string;
    value: string;
    constructor(name: string, value: string, product_id: string){
        this.name = name;
        this.value = value;
        this.product_id = product_id;
    }
}