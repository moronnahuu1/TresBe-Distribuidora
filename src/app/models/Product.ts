import { Feature } from "./Feature";

export class Product{
    name: string;
    category: string;
    brand: string;
    price: number;
    image: string;
    stock: number;
    quantity: number = 1;
    description: string;
    features: Feature[] = [];
    id: string;

    constructor(id: string, name: string, category: string, brand: string, price: number, image: string, stock: number, description: string, quantity: number){
        this.id = id;
        this.name = name;
        this.category = category;
        this.brand = brand;
        this.price = price;
        this.image = image;
        this.stock = stock;
        this.description = description;
        this.quantity = quantity;
    }
}