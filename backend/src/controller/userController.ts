import User from '../models/userModel';
import { Request, Response, NextFunction } from 'express';
import sendToken from '../utils/jwtToken';
import sendEmail from '../utils/sendEmail';
import Jwt from "jsonwebtoken";
// Sing Up
const singUp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { fullName, email, mobileNo, password } = req.body;
    const user:any = await User.findOne({ email: req.body.email });
    if (user?.isActive === false) {
      const token = await user.getJWTToken();
      const sendUrl = `http://localhost:3000/user/verifyemail/${token}`;
      const message = `\n\n Your Accont verification link is given below please go and verify\n\n${sendUrl}`;
      await sendEmail({
        email: email,
        subject: `Job Link Account verification`,
        message,
      });
      res.status(200).json({
        user,
        success: true,
        message: `Email send  to ${email} Successfully`,
      });
    } else {
      const user:any = await User.create({
        fullName,
        email,
        mobileNo,
        password,
      });
      console.log(user);
      await user.save();
      const token = await user.getJWTToken();
      const sendUrl = `http://localhost:3000/user/verifyemail/${token}`;
      console.log(sendUrl);
      const message = `\n\n Your Accont verification link is given below please go and verify\n\n${sendUrl}`;
      await sendEmail({
        email: email,
        subject: `Job Link Account verification`,
        message,
      });
      res.status(200).json({
        user,
        success: true,
        message: `Email send  to ${email} Successfully`,
      });
    }
  } catch (e: any) {
    if (e.code == 11000) {
      return res.status(409).json({
        message: "Email Id already exists, Please try signIn",
      });
    }
  }
};

const verifingUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const jwtsec: any = process.env.JWT_SECRET;
    const s: any = Jwt.verify(req.params.token, jwtsec);
    const id = s.id;
    const user:any = await User.findByIdAndUpdate(id,{isActive : true},{new : true,runValidators :  true});
    console.log(user);
    // sendToken(user, 200, res);
    const token = user.getJWTToken();
    const options = {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: true,
        samSite: 'none'
    };
    let t=`
    <h1>
    Successfully Verified
    </h1>
    <h3>
    <a href="http://localhost:4200/signUp">Click Here</a> to Login
    </h3>
    `
    res.status(200).cookie('token', token, options).send(t);
  } catch (e) {
    console.log(e);
  }
};

const singIn = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ error: "User not found Please First Sing Up" });
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return res.status(401).json({ error: "Invalid Email" });
  }
  if (!user.isActive) {
    return res
      .status(400)
      .json({ error: "Please confirm your email to login" });
  }
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return res.status(401).json({ error: "Invalid Password" });
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
export default { singUp, singIn, forgotPassword, resetPassword, logout, verifingUser };
