import { ApiError } from '../middlewares/errorHandler.js';
import Blog from "../model/blog.model.js";

export const getAllBlogs = async (req, res, next) => {
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

export const addBlog = async (req, res, next) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            throw new ApiError(400, 'Blog data is required');
        }
        const blog = await Blog.create({ ...req.body, blog_img_url: `/${req.file.filename}` });
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

export const deleteBlogById = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!id) {
            throw new ApiError(400, 'Blog ID is required');
        }
        let isDeleted = await Blog.findOneAndDelete(id);
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

export const getBlogById = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!id) {
            throw new ApiError(400, 'Blog ID is required');
        }
        const blog = await Blog.findById(id)
            .populate({
                path: 'comments',
                select: 'comment user',
                populate: {
                    path: 'user',
                    select: 'firstName email _id'
                }
            });

        console.log(blog);

        if (blog) {
            res.status(200).json({
                success: true,
                data: blog
            });
        }
        else {
            throw new ApiError(404, 'Blog not found');
        }
    } catch (error) {
        next(error);
    }
};

export const updateBlog = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!id) {
            throw new ApiError(400, 'Blog ID is required');
        }

        const updateData = { ...req.body };
        if (req.file) {
            updateData.blog_img_url = `/${req.file.filename}`;
        }

        const blog = await Blog.findByIdAndUpdate(id, updateData, { new: true });
        if (blog) {
            res.status(200).json({
                success: true,
                data: blog
            });
        }
        else {
            throw new ApiError(404, 'Blog not found');
        }
    } catch (error) {
        if (error.name === 'ValidationError') {
            return next(new ApiError(400, Object.values(error.errors).map(err => err.message).join(', ')));
        }
        next(error);
    }
}