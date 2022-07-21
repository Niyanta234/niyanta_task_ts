"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cloudinary_1 = require("cloudinary");
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const profileRoutes_1 = __importDefault(require("./routes/profileRoutes"));
const paymentRoutes_1 = __importDefault(require("./routes/paymentRoutes"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
// env config
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const port = process.env.PORT;
// mongoose Connect
const connect = () => {
    mongoose_1.default
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
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use((0, cors_1.default)({ credentials: true, origin: true }));
app.use(body_parser_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, express_fileupload_1.default)({
    useTempFiles: true
}));
// Cloudinary For Image Uploading
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
// Routes
app.use('/user', userRoutes_1.default);
app.use('/user', paymentRoutes_1.default);
app.use('/user', profileRoutes_1.default);
app.listen(port, () => {
    console.log(`http://localhost:${port}`);
});
