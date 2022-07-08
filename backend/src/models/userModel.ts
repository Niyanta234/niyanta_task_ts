import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config()
import crypto from "crypto";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
export interface UserDoc extends Document {
    fullName: string;
    email: string;
    password: string;
    mobileNo: Number;
    resetPasswordToken: String | undefined;
    resetPasswordExpire: Date | undefined;
    comparePassword: (pw: string) => Promise<boolean>;
    getResetPasswordToken: any ;
}
const UserSchema = new mongoose.Schema<UserDoc>({
    fullName : {
        type:String,
        required: [true, "Please Enter Your Full Name"],
        maxlength: [30, "Full Name cannot exceed 30 characters"],
        minlength: [4, "Full Name should have more than 4 characters"],
    },
    email:{
        type: String,
        unique: true,
        required:[true,"Please Enter Your Email"],
        validate: [validator.isEmail, "Please Enter a valid Email"]
    },
    mobileNo:{
        type:Number,
        required:[true,"Please Enter Your mobile No"],
        minlength:[10, "Mobile Number have 10 digit please write prooper formet"],
        mexlength:[10, "Mobile Number have 10 digit please write prooper formet"]

    },
    password:{
        type:String,
        required:[true,"Please Enter Your Password"],
        minlength:[8,"password should be grater than 8 characters"],
        select:false,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
});


// create password hash
UserSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        next()
    }
    this.password = await bcrypt.hash(this.password, 10)
});

// JWTToken Function
let secret:any = process.env.JWT_SECRET
UserSchema.methods.getJWTToken = function() {
    return jwt.sign({id: this._id}, secret ,{
        expiresIn: process.env.JWT_EXPIRE
    });
}
// Campare Password
UserSchema.methods.comparePassword = async function(password:string){
    return await bcrypt.compare(password, this.password);
}

// Password reset password token
UserSchema.methods.getResetPasswordToken = function(){
    //generating token
    const resetToken = crypto.randomBytes(20).toString("hex");
    
    //Hashing and adding resetPasswordToken to userSchema
    this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
    return resetToken;
}


 export default mongoose.model('User', UserSchema);