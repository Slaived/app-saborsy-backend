import {body, validationResult} from 'express-validator';
import {Request,Response, NextFunction} from 'express';

const handleValidationErrors = async(
    req: Request,
    res: Response,
    next: NextFunction
) :Promise<any> => {
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        console.log(errors);
        return res.status(400)
                    .json({errors: errors.array()});
    }
    next();
}//Fin de handleValidationErrors

export const validateUserRequest= [
    body("name").isString()
        .notEmpty()
        .withMessage("El nombre debe ser string"),
    
    body("address").isString()
    .notEmpty()
    .withMessage("La direccion debe ser string"),

    body("city").isString()
    .notEmpty()
    .withMessage("La ciudad debe ser string"),

    body("country").isArray()
    .notEmpty()
    .withMessage("El país debe ser string"),
    handleValidationErrors
];//Fin del validateUserRequest

export const validateRestauranteRequest = [
    body("restauranteName").notEmpty()
    .withMessage("El nombre del restaurante es requerido"),

    body("city").notEmpty()
    .withMessage("La ciudad es requerida"),

    body("country").notEmpty()
    .withMessage("El país es requerido"),

    body("deliveryPrice").isFloat( {min:0} )
    .withMessage("El precio de entrega debe ser un numero positivo"),

    body("estimatedDeliveryTime").isFloat( {min:0} )
    .withMessage("El tiempo estimado de entrega debe ser un numero positivo"),

    body("cuisines").isArray()
        .withMessage("Los platillos deben ser un arreglo")
        .not()
        .isEmpty()
        .withMessage("El arreglo de los platillos no puede estar vacío"),

    body("menuItems").isArray()
    .withMessage("Los platillos deben ser un arrglo"),

    body("menuItems.*.name").notEmpty()
    .withMessage("El nombre del item del menú es requerido"),

    body("menuItems.*.price").isFloat( {min:0 } )
    .withMessage("El precio del item del menu es requerido y debe ser un número positivo"),

    handleValidationErrors    
];//Fin de validateRestauranteRequest