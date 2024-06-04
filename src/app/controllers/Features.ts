import { Request, Response } from "express";
import Features from "../models/mysql/Features";

export const getFeatures = async (req: Request, res: Response) => {    
    const listFeatures = await Features.findAll();
    res.json(listFeatures);
}

export const getFeature = async (req: Request, res: Response) => {
    const { id } = req.params;
    const FeatureAux = await Features.findByPk(id);    
    if(FeatureAux){
        res.json(FeatureAux);
    } else {
        res.status(404).json({message: 'Error, Feature not found'})
    }
}
export const deleteFeature = async (req: Request, res: Response) => {
    const { id } = req.params;
    const FeatureAux = await Features.findByPk(`${id}`);
    if(FeatureAux){
        await FeatureAux.destroy();
        res.json({message: 'Feature successfully deleted'});
    } else{
        res.status(404).json({message: 'Error, Feature not found'})
    }
}
export const postFeature = async(req: Request, res: Response) => {
    const body = req.body;
    await Features.create(body);
    res.json({
        message: 'Feature successfully created',
    })
}
export const updateFeature = async(req: Request, res: Response) => {
    const body = req.body;
    const { id } = req.params;
    const FeatureAux = await Features.findByPk(id);
    if(FeatureAux){
        FeatureAux.update(body);
        res.json({
            message: 'Feature updated',
        })
    } else {
        res.status(404).json({message: 'Error, Feature not found'})
    }
}
export const deleteFeatures = async (req: Request, res: Response) => {
    await Features.destroy({truncate: true});
}