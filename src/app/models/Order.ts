
export class Order{
    id: string;
    code: string;
    discount: number;
    delivery: number;
    subtotal: number;
    total: number;
    orderDate: Date;
    userID: string;
    userdataId: string;
    payed: boolean = false;

    constructor(id: string, code: string, discount: number, delivery: number, subtotal: number, total: number, orderDate: Date, userID: string, userdataId: string){
        this.id = id;
        this.code = code;
        this.discount = discount;
        this.delivery = delivery;
        this.subtotal = subtotal;
        this.total = total;
        this.userID = userID;
        this.orderDate = orderDate; // TO DO
        this.userdataId = userdataId;
    }
}