import { Request, Response } from "express";
import Products from "../models/mysql/Products";

export const getProducts = async (req: Request, res: Response) => {    
    const listProducts = await Products.findAll();
    res.json(listProducts);
}

export const getProduct = async (req: Request, res: Response) => {
    const { id } = req.params;
    const productAux = await Products.findByPk(id);    
    if(productAux){
        res.json(productAux);
    } else {
        res.status(404).json({message: 'Error, Product not found'})
    }
}
export const deleteProduct = async (req: Request, res: Response) => {
    const { id } = req.params;
    const productAux = await Products.findByPk(`${id}`);
    if(productAux){
        await productAux.destroy();
        res.json({message: 'Product successfully deleted'});
    } else{
        res.status(404).json({message: 'Error, product not found'})
    }
}
export const postProduct = async(req: Request, res: Response) => {
    const body = req.body;
    await Products.create(body);
    res.json({
        message: 'Product successfully created',
    })
}
export const updateProduct = async(req: Request, res: Response) => {
    const body = req.body;
    const { id } = req.params;
    const productAux = await Products.findByPk(id);
    if(productAux){
        productAux.update(body);        
        res.json({
            message: 'Product updated SUCCESS',
        })
    } else {
        res.status(404).json({message: 'Error, product not found'})
    }
}
export const deleteProducts = async (req: Request, res: Response) => {
    await Products.destroy({truncate: true});
}