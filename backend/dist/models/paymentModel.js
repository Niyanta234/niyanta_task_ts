"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const paymentSchema = new mongoose_1.default.Schema({
    fullName: {
        type: String,
        required: [true, "Please Enter Your Full Name"],
        maxlength: [30, "Full Name cannot exceed 30 characters"],
        minlength: [4, "Full Name should have more than 4 characters"],
    },
    cardNo: {
        type: Number,
        required: [true, "Please Enter Your Card Number"],
        maxlength: [16, "Card Number have 16 digits"],
        minlength: [16, "Card Number have 16 digits"],
    },
    expiryDate: {
        type: Date,
        required: [true, "Please Enter card 's expiry Date"],
        default: Date.UTC(2023, 12),
    },
    cvv: {
        type: Number,
        required: [true, "Please Enter card 's cvv"],
        maxlength: [3, "CVV Cannot exceed 3 characters"],
        minlength: [3, "CVV Cannot exceed 3 characters"],
    },
    amount: {
        type: Number,
        required: [true, "Please Enter Your amount"],
        maxlength: [8, "Amount should be grater than 0"],
        default: 50,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
exports.default = mongoose_1.default.model("Payment", paymentSchema);
