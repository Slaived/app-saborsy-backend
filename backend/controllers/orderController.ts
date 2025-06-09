import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

//Pedido de usuario
const placeOrder = async (req,res) => {

    const frontend_url = "http://localhost:5174"

    try {
        const newOrder = new orderModel({
            userId:req.body.userId,
            items:req.body.items,
            amount:req.body.amount,
            address:req.body.address
        })
        await newOrder.save();
        await userModel.findByIdAndUpdate(req.body.userId,{cartData:{}});

        const line_items = req.body.items.map((item)=>({
            price_data:{
                currency:"mxn",
                product_data:{
                    name:item.name
                },
                unit_amount:item.price*10*10
            },
            quantity:item.quantity
        }))

        line_items.push({
            price_data:{
                currency:"mxn",
                product_data:{
                    name:"Cargo de Entrega"
                },
                unit_amount:2*10*10
            },
            quantity:1
        })

        const session = await stripe.checkout.sessions.create({
            line_items:line_items,
            mode:'payment',
            success_url:`${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url:`${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
        })
        res.json({success:true,session_url:session.url})

    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})                
    }
}

const verifyOrder = async (req,res) => {
    const {orderId,success} = req.body;
    try {
        if (success=="true") {
            await orderModel.findByIdAndUpdate(orderId,{payment:true});
            res.json({success:true,messsage:"Pagado"})
        }
        else {
            await orderModel.findByIdAndDelete(orderId);
            res.json({success:false,message:"No Pagado"})
        }
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})        
    }
}

//Ordenes de usuarios
const userOrders = async (req,res) => {
    try {
        const orders = await orderModel.find({userId:req.body.userId});
        res.json({success:true,data:orders})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})       
    }
}

//Listado de pedidos
const listOrders = async (req,res) => {
    try {
        const orders = await orderModel.find({});
        res.json({success:true,data:orders})
    } catch (error) {
        console.log(error);
        res.json({succes:false,message:"Error"})       
    }
}

//Actualizacion de estado de orden
const updateStatus = async (req,res) => {
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId,{status:req.body.status});
        res.json({success:true,message:"Estado Actualizado"})
    } catch (error) {
        console.log(error);
        res.json({succes:false,message:"Error"})  
    }
}


export {placeOrder,verifyOrder,userOrders,listOrders,updateStatus}

