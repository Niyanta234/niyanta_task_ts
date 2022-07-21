"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const expire = process.env.COOKIE_EXPIRE;
const sendToken = (user, statusCode, res) => {
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
exports.default = sendToken;
