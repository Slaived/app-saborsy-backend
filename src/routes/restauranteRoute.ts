import express from 'express';
import multer from 'multer';
import { createRestaurante, getRestaurante, updateRestaurante } from '../controllers/restauranteController';
import {jwtCheck, jwtParse } from '../middleware/auth'
import { validateRestauranteRequest } from '../middleware/validation';

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1025 * 1024, //5mb
    }
});

//Ruta para obtener los datos de un restaurante
router.get('/',
    jwtCheck,
jwtParse,
getRestaurante
);

//Rutas para crear el restaurante
router.post('/',
    jwtCheck,
    jwtParse,
     upload.single("imageFile"),
     validateRestauranteRequest,
     createRestaurante
);

//Ruta para actualizar un restaurante
router.put('/',
    jwtCheck,
    jwtParse,
    upload.single("ImageFile"),
    validateRestauranteRequest,
    updateRestaurante
);

export default router;