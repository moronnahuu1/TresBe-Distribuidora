import { Feature } from "./Feature";

export class Product{
    name: string;
    category: string;
    price: number;
    image: string;
    stock: number;
    description: string;
    features: Feature[] = [];
    id: string | undefined;

    constructor(name: string, category: string, price: number, image: string, stock: number, description: string){
        this.name = name;
        this.category = category;
        this.price = price;
        this.image = image;
        this.stock = stock;
        this.description = description;
    }
}