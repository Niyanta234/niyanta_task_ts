import express from 'express';
const router = express.Router();
import controller from '../controller/profileController';
import isAuthenticatedUser from '../middleware/auth';

router.get('/profile', isAuthenticatedUser, controller.getProfile);
router.post('/profile', isAuthenticatedUser, controller.setProfile);

export default router;
