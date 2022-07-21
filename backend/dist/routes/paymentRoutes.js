"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const paymentController_1 = __importDefault(require("../controller/paymentController"));
const auth_1 = __importDefault(require("../middleware/auth"));
router.post('/addpayment', auth_1.default, paymentController_1.default.payment);
router.get('/paymenthistory', auth_1.default, paymentController_1.default.getPaymentHistory);
exports.default = router;
