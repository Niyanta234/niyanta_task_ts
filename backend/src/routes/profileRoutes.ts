import express from "express"
const router = express.Router()
import controller from "../controller/profileController";


router.post('/profile', controller.profile);

export default router