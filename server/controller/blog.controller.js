import { ApiError } from '../middlewares/errorHandler.js';
import Blog from "../model/blog.model.js";

export const getAllBlogs = async(req, res, next) => {
    try {
        const blogs = await Blog.find();
        res.status(200).json({
            success: true,
            data: blogs
        });
    } catch (error) {
        next(error);
    }
};

export const addBlog = async(req, res, next) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            throw new ApiError(400, 'Blog data is required');
        }
        const blog = await Blog.create({...req.body, blog_img_url: `/${req.file.filename}` });
        res.status(201).json({
            success: true,
            data: blog
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return next(new ApiError(400, Object.values(error.errors).map(err => err.message).join(', ')));
        }
        next(error);
    }
};

export const deleteBlogById = async(req, res, next) => {
    try {
        const { _id } = req.body;
        let isDeleted = await Blog.findOneAndDelete(_id);
        if (isDeleted) {
            res.status(200).json({
                success: true,
                message: 'Blog Deleted Successfully.'
            });
        }
    } catch (error) {
        next(error);
    }
}

export const updateBlog = async(req, res, next) => {
    try {

    } catch (error) {
        if (error.name === 'ValidationError') {
            return next(new ApiError(400, Object.values(error.errors).map(err => err.message).join(', ')));
        }
        next(error);
    }
}