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
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const crypto_1 = __importDefault(require("crypto"));
const validator_1 = __importDefault(require("validator"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const UserSchema = new mongoose_1.default.Schema({
    fullName: {
        type: String,
        required: [true, "Please Enter Your Full Name"],
        maxlength: [30, "Full Name cannot exceed 30 characters"],
        minlength: [3, "Full Name should have more than 4 characters"],
    },
    email: {
        type: String,
        unique: true,
        required: [true, "Please Enter Your Email"],
        validate: [validator_1.default.isEmail, "Please Enter a valid Email"]
    },
    mobileNo: {
        type: Number,
        required: [true, "Please Enter Your mobile No"],
        minlength: [10, "Mobile Number have 10 digit please write prooper formet"],
        mexlength: [10, "Mobile Number have 10 digit please write prooper formet"]
    },
    password: {
        type: String,
        required: [true, "Please Enter Your Password"],
        minlength: [8, "password should be grater than 8 characters"],
        select: false,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
});
// create password hash
UserSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isModified("password")) {
            next();
        }
        this.password = yield bcrypt_1.default.hash(this.password, 10);
    });
});
// JWTToken Function
let secret = process.env.JWT_SECRET;
UserSchema.methods.getJWTToken = function () {
    return jsonwebtoken_1.default.sign({ id: this._id }, secret, {
        expiresIn: process.env.JWT_EXPIRE
    });
};
// Campare Password
UserSchema.methods.comparePassword = function (password) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcrypt_1.default.compare(password, this.password);
    });
};
// Password reset password token
UserSchema.methods.getResetPasswordToken = function () {
    //generating token
    const resetToken = crypto_1.default.randomBytes(20).toString("hex");
    //Hashing and adding resetPasswordToken to userSchema
    this.resetPasswordToken = crypto_1.default
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");
    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
    return resetToken;
};
exports.default = mongoose_1.default.model('User', UserSchema);
