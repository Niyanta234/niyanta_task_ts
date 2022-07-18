import dotenv from 'dotenv';
import { Response } from 'express';
dotenv.config();
const expire: any = process.env.COOKIE_EXPIRE;
const sendToken = (user: any, statusCode: number, res: Response) => {
    const token = user.getJWTToken();
    const options = {
        expires: new Date(Date.now() + expire * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: true,
        samSite: 'none'
    };
    res.status(statusCode).cookie('token', token, options).json({
        success: true,
        user,
        token
    });
};
export default sendToken;
