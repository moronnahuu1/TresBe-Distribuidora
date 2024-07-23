export class PriceXproduct{
    id: string;
    optionID: string;
    priceList1: number;
    priceList2: number;
    priceList3: number;
    priceList4: number;

    constructor(id: string, optionID: string, priceList1: number, priceList2: number, priceList3: number, priceList4: number){
        this.id = id;
        this.optionID = optionID;
        this.priceList1 = priceList1;
        this.priceList2 = priceList2;
        this.priceList3 = priceList3;
        this.priceList4 = priceList4;
    }
}