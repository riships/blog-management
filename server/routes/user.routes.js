import { Router } from "express";
import { addUser, getUserData, login } from "../controller/user.controller.js";
import verifyJwt from "../middlewares/jwtVerify.js";
import upload from "../middlewares/fileuploader.js";
const router = Router();

router.route('/signup').post(upload.single('userProfile'), addUser)
router.route('/login').post(login);
router.route('/').get(verifyJwt, getUserData); // Get user data



export default router;  //export the router to use in other files.  //export default router