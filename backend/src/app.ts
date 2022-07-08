import express, { Application, Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import userRoute from './routes/userRoutes';
import profileRoute from './routes/profileRoutes';
import paymentRoute from './routes/paymentRoutes';
import cors from 'cors';

const app: Application = express();

// env config
import dotenv from 'dotenv';
dotenv.config();
const port = process.env.PORT;

// mongoose Connect
const connect = () => {
    mongoose
        .connect('mongodb://localhost:27017/user')
        .then(() => {
            console.log('connected');
        })
        .catch((err) => {
            console.log(err);
        });
};
connect();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors())
app.use(bodyParser.json());
app.use(cookieParser());
app.use(
    fileUpload({
        useTempFiles: true
    })
);

// Cloudinary For Image Uploading
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Routes
app.use('/user', userRoute);
app.use('/user', paymentRoute);
app.use('/user', profileRoute);

app.listen(port, () => {
    console.log(`http://localhost:${port}`);
});
