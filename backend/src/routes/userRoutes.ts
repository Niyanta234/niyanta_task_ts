import express from "express"
const router = express.Router()
import controller from '../controller/userController';

router.post("/signup",controller.singUp );
router.post('/login', controller.singIn);
router.post('/password/forgot', controller.forgotPassword);
router.put('/resetpassword/:token', controller.resetPassword);
router.get('/logout', controller.logout);
export default router