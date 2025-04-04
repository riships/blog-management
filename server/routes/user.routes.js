import { Router } from "express";
import { addUser, login } from "../controller/user.controller.js";
import verifyJwt from "../middlewares/jwtVerify.js";
const router = Router();

router.route('/signup').post(addUser)
router.route('/login').post(login);



export default router;  //export the router to use in other files.  //export default router