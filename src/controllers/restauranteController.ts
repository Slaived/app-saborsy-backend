import { Request, Response} from 'express';
import Restaurante from '../models/restauranteModel'
import Multer from 'multer';
import cloudinary from 'cloudinary'
import mongoose from 'mongoose';

//Función para obtener los datos de un restaurante
export const getRestaurante = async (req:Request, res:Response):Promise<any> =>{
    try {
        const restaurante = await Restaurante.findOne( {user:req.userId } )
        if (!restaurante){
            return res.status(404)
                      .json({message: 'Restaurante no encontrado'})
        }
        res.json(restaurante);        
    } catch (error) {
        console.log(error);
        res.status(500)
            .json({message: 'Error al obtener los datos de un restaurante'})       
    }
}//Fin de getTestaurante

//Función para crear un restaurante
export const createRestaurante = async (req: Request, res: Response):Promise<any> => {
    try {
        const existingRestaurante = await Restaurante.findOne({user: req.userId});

        if(existingRestaurante){
            return res.status(500)
                      .json({message: 'El restaurante para este usuario ya existe'})
        }

        const imageUrl = await uploadImage(req.file as Express.Multer.File);
             

        //Creamos el objeto restaurante y lo almacenamos en la base de datos
        const restaurante = new Restaurante(req.body);
        restaurante.imageUrl = imageUrl
        restaurante.user = new mongoose.Types.ObjectId(req.userId);
        restaurante.lastUpdated = new Date();

        await restaurante.save();
        res.status(201)
            .json(restaurante);

    } catch (error) {
        console.log(error);
        res.status(500)
           .json({message: 'Error al crear un restaurante'})       
    }
};//Fin de createRestaurante

//Función para actualizar un restaurante
export const updateRestaurante = async (req: Request, res: Response):Promise<any>=>{
    try {
        let restaurante = await Restaurante.findOne( { User: req.userId } )
        if (!restaurante){
            res.status(404)
                        .json({message: 'Restaurante no encontrado'})
        }
        //Actualizamos los datos del restaurante
        restaurante!.restauranteName = req.body.restauranteName;   
        restaurante!.city = req.body.city;
        restaurante!.country = req.body.country;
        restaurante!.deliveryPrice = req.body.deliveryPrice;
        restaurante!.estimatedDeliveryTime = req.body.estimatedDeliveryTime;
        restaurante!.cuisines = req.body.cuisines;
        restaurante!.menuItems = req.body.menuItems; 
        restaurante!.lastUpdated = new Date();

        //Actualizamos la imagen
        if(req.file) {
            const imageUrl = await uploadImage(req.file as Express.Multer.File);
            restaurante!.imageUrl = imageUrl;
        }

        await restaurante?.save();
        res.status(200)
            .send(restaurante);
        
    } catch (error) {
        console.log(error);
        res.status(500)
            .json({message: 'Error al actualizar el restaurante'})        
    }
}//Fin de updateRestaurante

const uploadImage = async (file: Express.Multer.File)=>{
    //Creamos una url de cloudinary para la imagen del restaurante
    const image = file;

    //Convertimos el objeto de la imagen a un objeto base64 para poderlo
    //almacenar como imagen en Cloudinary

    const base64Image = Buffer.from(image.buffer).toString("base64");
    const dataUri = "data:" + image.mimetype + ";base64," + base64Image;

    //Subimos la imagen a Cloudinary
    const uploadResponse = await cloudinary.v2.uploader.upload(dataUri);

    //Retornamos la url de la imagen en Cloudinary
    return uploadResponse.url;
}
