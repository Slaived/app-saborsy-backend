import {body, validationResult} from 'express-validator';
import {Request,Response, NextFunction} from 'express';

const handleValidationErrors = async(
    req: Request,
    res: Response,
    next: NextFunction
) :Promise<any> => {
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.status(400)
                    .json({message: errors.array()});
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

    body("country").isString()
    .notEmpty()
    .withMessage("El país debe ser string"),
    handleValidationErrors
];//Fin del validateUserRequest