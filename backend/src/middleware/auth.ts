import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
dotenv.config();
import jwt from 'jsonwebtoken';
import User from '../models/userModel';
const isAuthenticatedUser = async (req: any, res: Response, next: NextFunction) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            return res.status(401).json({ error: 'Please Login to access this resource' });
        }
        const secret: any = process.env.JWT_SECRET;
        const decodedData: any = jwt.verify(token, secret);
        req.user = await User.findById(decodedData.id);
        next();
    } catch (e) {
        res.status(401).json({ error: e });
    }
};
export default isAuthenticatedUser;
