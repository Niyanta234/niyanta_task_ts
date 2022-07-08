import express from "express"
const router = express.Router()
import controller from "../controller/paymentController";


router.post('/addpayment', controller.payment);
router.get('/paymenthistory', controller.getPaymentHistory)

export default router