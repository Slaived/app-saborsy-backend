import express  from "express";
import {createUser, updateUser, getUser} from "../controllers/userController";
import { jwtCheck, jwtParse} from '../middleware/auth';
import { validateUserRequest } from "../middleware/validation";

const router = express.Router();

router.post('/', jwtCheck, createUser);
router.put('/', jwtCheck, jwtParse, validateUserRequest, updateUser);
router.get('/', jwtCheck, jwtParse, getUser);

export default router;



