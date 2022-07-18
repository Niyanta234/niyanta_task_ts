import Payment from '../models/paymentModel';
import { Request, Response, NextFunction } from 'express';
const payment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { fullName, cardNo, expiryDate, cvv, amount } = req.body;
        const userPayment = await Payment.create({
            fullName,
            cardNo,
            expiryDate,
            cvv,
            amount
        });
        res.status(200).json({ data: userPayment });
    } catch (e) {
        // console.log(e);

        res.status(400).json({ error: e });
    }
};

const getPaymentHistory = async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query as {
        [key: string]: string;
    };
    // pagination
    const itemsPerPage = parseInt(query.itemsPerPage as string) || 3;
    const pageNo = parseInt(query.pageNo as string) || 1;
    const skip = itemsPerPage * (pageNo - 1);

    // sorting
    const sortObj: Record<string, 1 | -1> = {};
    sortObj[query.sortBy as string] = query.reverse === 'true' ? -1 : 1;

    const count = await Payment.countDocuments();
    const results = await Payment.find().sort(sortObj).skip(skip).limit(itemsPerPage);
    res.status(200).json({
        success: true,
        results,
        count
    });
};
export default { payment, getPaymentHistory };
