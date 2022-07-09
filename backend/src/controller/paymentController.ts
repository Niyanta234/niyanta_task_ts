import Payment from "../models/paymentModel";
import { Request, Response, NextFunction } from 'express';
const payment = async (req: Request, res: Response, next: NextFunction) => {
    
    try {
        
        const {fullName, cardNo, expiryDate, cvv, amount} = req.body;
        const userPayment = await Payment.create({
            fullName,
            cardNo,
            expiryDate,
            cvv,
            amount
        })
        res.status(200).json({data:userPayment})
    } catch (e) {
        // console.log(e);
        
        res.status(400).json({error: e})
    }
}

const getPaymentHistory = async (req: Request, res: Response, next: NextFunction) => {
    const results = await Payment.find().sort({fullName : 1})
    res.status(200).json({
        success: true,
        results,
    })
}
export default {payment, getPaymentHistory}