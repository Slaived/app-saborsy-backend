import userModel from "../models/userModel.js"

//añadir productos a carrito del usuario
const addToCart = async (req,res) => {
    try {
        let userData = await userModel.findById(req.body.userId);
        let cartData = await userData.cartData;
        if(!cartData[req.body.itemId])
        {
            cartData[req.body.itemId] = 1;
        }
        else {
            cartData[req.body.itemId] += 1;
        }
        await userModel.findByIdAndUpdate(req.body.userId,{cartData});
        res.json({success:true,message:"Añadido al Carrito"});
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
        
    }
}

//Eliminar productos del carrito del usuario
const removeFromCart = async (req,res) => {
    try {
        let userData = await userModel.findById(req.body.userId)
        let cartData = await userData.cartData;
        if (cartData[req.body.itemId]>0) {
            cartData[req.body.itemId] -= 1;
        }
        await userModel.findByIdAndUpdate(req.body.userId,{cartData});
        res.json({success:true,message:"Eliminado del Carrito"})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})        
    }
}

//obtener datos del carrito del usuario
const getCart = async (req,res) => {
    try {
        let userData = await userModel.findById(req.body.userId);
        let cartData = await userData.cartData;
        res.json({success:true,cartData})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})        
    }
}

export {addToCart,removeFromCart,getCart}




