import {Request, Response, NextFunction} from 'express';
import { auth } from "express-oauth2-jwt-bearer";
import jwt from 'jsonwebtoken';
import User from '../models/userModels';

declare global{
    namespace Express {
        interface Request{
            userId: string,
            auth0Id: string
        }
    }
}//Fin de declare

export const jwtCheck = auth({
    audience: process.env.AUTH0_AUDIENCE,
    issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
    tokenSigningAlg: 'RS256'
});

export const jwtParse = async (req: Request, res: Response, next: NextFunction): Promise<any>=>{
    const {authorization } = req.headers;

    if(!authorization || !authorization.startsWith('Bearer')) {
        console.log("jwtParse - Authorización denegada")
        return res.sendStatus(401)
                    .json({message: 'Authorización denegada'})
    }//Fin de if(!authorization)
    const token = authorization.split(" ")[1];

    try {
        const decoded = jwt.decode(token) as jwt.JwtPayload;

        const auth0Id = decoded.sub;

        const user = await User.findOne({ auth0Id })

        if (!user) {
            console.log("jwtParse - !user find Authorización denegada")
            return res.sendStatus(401)
                        .json({message: 'Authorización denegada'})
        }
        req.auth0Id = auth0Id as string;
        req.userId = user._id.toString();
        console.log("jwtParse - Authorización concedida")
        next();

    } catch (error) {
        console.log("jwtParse - Authorización denegada");
        return res.sendStatus(401)
                    .json({message: 'Authorization denegada'})
    }//Fin del catch
}//Fin de jwtParse