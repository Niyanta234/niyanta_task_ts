import User from '../models/userModel';
import { Request, Response, NextFunction } from 'express';
import sendToken from '../utils/jwtToken';
import sendEmail from '../utils/sendEmail';

// Sing Up
const singUp = async (req: Request, res: Response, next: NextFunction) => {
    console.log('sign up request');

    try {
        const { fullName, email, mobileNo, password } = req.body;
        const user = await User.create({
            fullName,
            email,
            password,
            mobileNo
        });
        const message = `Your Account Sign Up with this email id ${req.body.email} if you are not that person then go in Website And reset your password`;
        await sendEmail({
            email: email,
            subject: `Job Link Password Recovery`,
            message
        });
        res.status(200).json({
            user,
            success: true,
            message: `Email send  to ${email} Successfully`
        });
    } catch (e: any) {
        if (e.code == 11000) {
            return res.status(409).json({
                message: 'Email Id already exists, Please try signIn'
            });
        }
        res.status(500).json({ error: e });
        console.log(e);
    }
    // sendToken(user, 200, res);
};

// Sing In
const singIn = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'User not found Please First Sing Up' });
    }
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
        return res.status(401).json({ error: 'Invalid Email' });
    }
    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
        return res.status(401).json({ error: 'Invalid Password' });
    }
    sendToken(user, 200, res);
};

// Forget Password
const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return res.status(404).json({ error: 'User Not found' });
    }
    // Get Resetpassword Token
    const resetToken = user.getResetPasswordToken();
    user.resetPasswordToken = resetToken;
    //   console.log(resetToken);
    await user.save({ validateBeforeSave: false });
    const resetPasswordURI = `http://localhost:4200/user/resetpassword/${resetToken}`;
    const message = `
  Your password reset token is :- \n\n ${resetPasswordURI}\n\n 
  If you have not requested this email then please ignore it`;

    try {
        await sendEmail({
            email: user.email,
            subject: `Job Link Password Recovery`,
            message
        });
        res.status(200).json({
            success: true,
            message: `Email send  to ${user.email} Successfully`
        });
    } catch (e) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });
        res.status(500).json({ error: e });
    }
};

// reset password
const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    // creating Token Hash
    const resetPasswordToken = req.params.token;
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    });
    if (!user) {
        return res.status(404).json({ error: 'Reset password Token Is Invalid Or Has Been Expired' });
    }

    user.password = req.body.password.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();
    sendToken(user, 200, res);
};

// Log Out Check cookie expires or not
const logout = async (req: Request, res: Response, next: NextFunction) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    });
    res.status(200).json({
        success: true,
        message: 'Logged Out'
    });
};
export default { singUp, singIn, forgotPassword, resetPassword, logout };
