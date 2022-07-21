"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const userController_1 = __importDefault(require("../controller/userController"));
router.post("/signup", userController_1.default.singUp);
router.post('/login', userController_1.default.singIn);
router.post('/password/forgot', userController_1.default.forgotPassword);
router.put('/resetpassword/:token', userController_1.default.resetPassword);
router.get('/logout', userController_1.default.logout);
exports.default = router;
