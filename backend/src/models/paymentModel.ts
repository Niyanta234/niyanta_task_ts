import mongoose from "mongoose";
import validator from "validator";
const paymentSchema = new mongoose.Schema({
    fullName: {
        type:String,
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
      required:[true,"Please Enter card 's expiry Date"],
      default: Date.UTC(2023, 12),
    },
    cvv: {
      type: Number,
      required:[true,"Please Enter card 's cvv"],
      maxlength: [3, "CVV Cannot exceed 3 characters"],
      minlength: [3, "CVV Cannot exceed 3 characters"],
    },
    amount: {
      type: Number,
      required:[true,"Please Enter Your amount"],
      maxlength: [8, "Amount should be grater than 0"],
      default: 50,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  });
  
export default mongoose.model("Payment", paymentSchema);
  