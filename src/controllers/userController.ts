import { Request, Response } from "express";
import User from '../models/userModels';

export const createUser = async (req:Request, res:Response):Promise<any>=>{
    try {
        const { auth0Id } = req.body;
        const existingUser = await User.findOne( {auth0Id});

        if (existingUser){
            return res.status(200)
                        .json(existingUser);
        }
        const newUser = new User(req.body)
        await newUser.save();

        res.status(201)
            .json(newUser.toObject());
    } catch (error) {
        console.log(error);
        res.status(500)
            .json({message: 'Error al crear el usuario'})       
    }
}//Fin de createUser

export const updateUser = async (req:Request, res: Response):Promise<any>=>{
    try {
        console.log(req.body);
        const {name, address, city, country} = req.body;
        const user = await User.findById(req.userId);
        if (!user){
            res.status(404)
                .json({mesage: 'Usuario no encontrado'})

            user!.name = name;
            user!.address = address;
            user!.city = city;
            user!.country = country;

            await user!.save();
            res.send(user);   
        }        
    }catch (error) {
        console.log(error);
        res.status(500)
            .json({message: 'Error al actualizar el usuario'})        
    }
}//Fin de updateUser

export const getUser = async(req: Request, res: Response):Promise<any>=>{
    try {
        const currentUser = await User.findById({_id: req.userId});

        if (!currentUser)
            return res.status(404)
                        .json({message: 'Usuario no encontrado'});
        res.json(currentUser);
    } catch (error) {
        console.log(error);
        res.status(500)
            .json({message: 'Error al obtener el usuario'})        
    }
}//Fin de getUser


