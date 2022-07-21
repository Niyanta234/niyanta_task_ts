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
const paymentModel_1 = __importDefault(require("../models/paymentModel"));
const payment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fullName, cardNo, expiryDate, cvv, amount } = req.body;
        const userPayment = yield paymentModel_1.default.create({
            fullName,
            cardNo,
            expiryDate,
            cvv,
            amount
        });
        res.status(200).json({ data: userPayment });
    }
    catch (e) {
        // console.log(e);
        res.status(400).json({ error: e });
    }
});
const getPaymentHistory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    // pagination
    const itemsPerPage = parseInt(query.itemsPerPage) || 3;
    const pageNo = parseInt(query.pageNo) || 1;
    const skip = itemsPerPage * (pageNo - 1);
    // sorting
    const sortObj = {};
    sortObj[query.sortBy] = query.reverse === 'true' ? -1 : 1;
    const count = yield paymentModel_1.default.countDocuments();
    const results = yield paymentModel_1.default.find().sort(sortObj).skip(skip).limit(itemsPerPage);
    res.status(200).json({
        success: true,
        results,
        count
    });
});
exports.default = { payment, getPaymentHistory };
