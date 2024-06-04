import { Request, Response } from "express";
import Users from "../models/mysql/Users";

export const getUsers = async (req: Request, res: Response) => {    
    const listUsers = await Users.findAll();
    res.json(listUsers);
}

export const getUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    const UserAux = await Users.findByPk(id);    
    if(UserAux){
        res.json(UserAux);
    } else {
        res.status(404).json({message: 'Error, User not found'})
    }
}
export const deleteUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    const UserAux = await Users.findByPk(`${id}`);
    if(UserAux){
        await UserAux.destroy();
        res.json({message: 'User successfully deleted'});
    } else{
        res.status(404).json({message: 'Error, User not found'})
    }
}
export const postUser = async(req: Request, res: Response) => {
    const body = req.body;
    await Users.create(body);
    res.json({
        message: 'User successfully created',
    })
}
export const updateUser = async(req: Request, res: Response) => {
    const body = req.body;
    const { id } = req.params;
    const UserAux = await Users.findByPk(id);
    if(UserAux){
        UserAux.update(body);
        res.json({
            message: 'User updated',
        })
    } else {
        res.status(404).json({message: 'Error, User not found'})
    }
}
export const deleteUsers = async (req: Request, res: Response) => {
    await Users.destroy({truncate: true});
}