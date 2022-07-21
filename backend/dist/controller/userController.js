"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userModel_1 = __importDefault(require("../models/userModel"));
const jwtToken_1 = __importDefault(require("../utils/jwtToken"));
const sendEmail_1 = __importDefault(require("../utils/sendEmail"));
// Sing Up
const singUp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('sign up request');
    try {
        const { fullName, email, mobileNo, password } = req.body;
        const user = yield userModel_1.default.create({
            fullName,
            email,
            password,
            mobileNo
        });
        const message = `Your Account Sign Up with this email id ${req.body.email} if you are not that person then go in Website And reset your password`;
        yield (0, sendEmail_1.default)({
            email: email,
            subject: `Job Link Password Recovery`,
            message
        });
        res.status(200).json({
            user,
            success: true,
            message: `Email send  to ${email} Successfully`
        });
    }
    catch (e) {
        if (e.code == 11000) {
            return res.status(409).json({
                message: 'Email Id already exists, Please try signIn'
            });
        }
        res.status(500).json({ error: e });
        console.log(e);
    }
    // sendToken(user, 200, res);
});
// Sing In
const singIn = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'User not found Please First Sing Up' });
    }
    const user = yield userModel_1.default.findOne({ email }).select('+password');
    if (!user) {
        return res.status(401).json({ error: 'Invalid Email' });
    }
    const isPasswordMatched = yield user.comparePassword(password);
    if (!isPasswordMatched) {
        return res.status(401).json({ error: 'Invalid Password' });
    }
    (0, jwtToken_1.default)(user, 200, res);
});
// Forget Password
const forgotPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userModel_1.default.findOne({ email: req.body.email });
    if (!user) {
        return res.status(404).json({ error: 'User Not found' });
    }
    // Get Resetpassword Token
    const resetToken = user.getResetPasswordToken();
    user.resetPasswordToken = resetToken;
    //   console.log(resetToken);
    yield user.save({ validateBeforeSave: false });
    const resetPasswordURI = `http://localhost:4200/user/resetpassword/${resetToken}`;
    const message = `
  Your password reset token is :- \n\n ${resetPasswordURI}\n\n 
  If you have not requested this email then please ignore it`;
    try {
        yield (0, sendEmail_1.default)({
            email: user.email,
            subject: `Job Link Password Recovery`,
            message
        });
        res.status(200).json({
            success: true,
            message: `Email send  to ${user.email} Successfully`
        });
    }
    catch (e) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        yield user.save({ validateBeforeSave: false });
        res.status(500).json({ error: e });
    }
});
// reset password
const resetPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // creating Token Hash
    const resetPasswordToken = req.params.token;
    const user = yield userModel_1.default.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    });
    if (!user) {
        return res.status(404).json({ error: 'Reset password Token Is Invalid Or Has Been Expired' });
    }
    user.password = req.body.password.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    yield user.save();
    (0, jwtToken_1.default)(user, 200, res);
});
// Log Out Check cookie expires or not
const logout = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    });
    res.status(200).json({
        success: true,
        message: 'Logged Out'
    });
});
exports.default = { singUp, singIn, forgotPassword, resetPassword, logout };
