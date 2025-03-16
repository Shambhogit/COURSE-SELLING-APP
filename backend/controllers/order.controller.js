import { Order } from "../models/order.model.js";
import { Purchase } from "../models/purchase.model.js";

export const orderData = async (req, res)=>{
    const order = req.body;
    try {
        const orderInfo = await Order.create(order);
        console.log(orderInfo);
        const userId = orderInfo?.userId;
        const courseId = orderInfo?.courseId;

        res.status(201).json({message:"Order Details", orderInfo});
        if(orderInfo){
            const newPurchase = new Purchase({userId, courseId});
            await newPurchase.save();
        }
    } catch (error) {
        console.log({'Error in orderData': error});
        res.status(401).json({error: 'Error in orderData'});
    }
}