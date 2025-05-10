import express, {Request,Response} from 'express';
import cors from 'cors';
import'dotenv/config';
import mongoose from 'mongoose';
import morgan from 'morgan';

//Importamnos el archivo de ruta de usuarios
import userRoutes from './routes/userRoutes';

//Importamos la configuración de autenticación auth0


//Conexión a la base de datos
mongoose.connect(process.env.DB_CONNECTION_STRING as string)
.then( ()=>{
    console.log("Base de datos conectada");    
})
.catch( (e)=>{
    console.log("Error al conectar");
    console.log(e);   
})


const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

//Rita para verificar que el servidor se esta ejecutando
app.get('/health', async (req:Request, res:Response)=>{
    res.send({message:"¡Servidor OK!"})
})

app.get('/', async(req: Request, res: Response)=>{
    res.redirect('/health');
})
app.use("/api/user", userRoutes);

const port = process.env.port || 3000

app.listen(port, ()=>{
    console.log("App corriendo en el puerto: " + port);    
})