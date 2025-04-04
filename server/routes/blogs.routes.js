import { Router } from "express";
import { getAllBlogs, addBlog } from "../controller/blog.controller.js";
import { validateBlog } from '../middlewares/blogValidation.js';
import verifyJwt from "../middlewares/jwtVerify.js";
import upload from "../middlewares/fileuploader.js";

const router = Router();

router
    .route('/')
    .get(verifyJwt, getAllBlogs) // Get all blogs (authentication required)
    .post(verifyJwt, upload.single('blogImg'), validateBlog, addBlog); // Validate & add a new blog

export default router; //export the router to use it in other files