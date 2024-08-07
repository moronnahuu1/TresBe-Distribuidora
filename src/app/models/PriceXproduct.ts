export class PriceXproduct{
    id: string;
    optionID: string;
    priceList1: number;
    priceList2: number;
    priceList3: number;
    priceList4: number;
    priceListE: number;
    priceListG: number;
    costPrice: number;


    constructor(id: string, optionID: string, priceList1: number, priceList2: number, priceList3: number, priceList4: number, priceListE: number, priceListG: number, costPrice: number){
        this.id = id;
        this.optionID = optionID;
        this.priceList1 = priceList1;
        this.priceList2 = priceList2;
        this.priceList3 = priceList3;
        this.priceList4 = priceList4;
        this.priceListE = priceListE;
        this.priceListG = priceListG;
        this.costPrice = costPrice;
    }
}