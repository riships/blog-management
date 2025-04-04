import { Router } from "express";
import { getAllBlogs, addBlog, deleteBlogById, updateBlog, getBlogById } from "../controller/blog.controller.js";
import { validateBlog } from '../middlewares/blogValidation.js';
import verifyJwt from "../middlewares/jwtVerify.js";
import upload from "../middlewares/fileuploader.js";
import { addComment } from "../controller/comment.controller.js";

const router = Router();

router
    .route('/')
    .get(verifyJwt, getAllBlogs) // Get all blogs
    .post(verifyJwt, upload.single('blogImg'), validateBlog, addBlog); // Add new blog

router
    .route('/:id')
    .get(verifyJwt, getBlogById) // Get a blog by ID
    .delete(verifyJwt, deleteBlogById) // Delete a blog by ID
    .put(verifyJwt, upload.single('blogImg'), validateBlog, updateBlog); // Update a blog by ID


router
    .route('/:id/comments')
    .post(verifyJwt, addComment);


export default router; //export the router to use it in other files