import { Product } from "./Product";

export class Order{
    id: string;
    code: string;
    discount: number;
    delivery: number;
    subtotal: number;
    total: number;
    userID: string;

    constructor(id: string, code: string, discount: number, delivery: number, subtotal: number, total: number, userID: string){
        this.id = id;
        this.code = code;
        this.discount = discount;
        this.delivery = delivery;
        this.subtotal = subtotal;
        this.total = total;
        this.userID = userID;
    }
}