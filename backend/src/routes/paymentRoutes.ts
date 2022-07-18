import express from 'express';
const router = express.Router();
import controller from '../controller/paymentController';
import isAuthenticatedUser from '../middleware/auth';

router.post('/addpayment', isAuthenticatedUser, controller.payment);
router.get('/paymenthistory', isAuthenticatedUser, controller.getPaymentHistory);

export default router;
