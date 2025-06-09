import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://Victor_felix:eBCRAVscjCYfyht4@cluster0.bmuhwav.mongodb.net/SaborSy').then(()=>console.log("Base de datos conectada"));
    
}