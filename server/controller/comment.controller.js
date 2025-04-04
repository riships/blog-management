import Blog from "../model/blog.model.js";
import Comments from "../model/comment.model.js";
import User from "../model/user.model.js";

export const addComment = async (req, res, next) => {
    try {
        const blogId = req.params.id;
        const userId = req.user.id;
        
        if (!blogId) {
            return res.status(400).json({
                success: false,
                message: "Blog ID is required"
            });
        }
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required"
            });
        }
        const comment = new Comments({ ...req.body, user: userId, blog: blogId });
        if (!comment) {
            return res.status(400).json({
                success: false,
                message: "Comment is required"
            });
        }
        // Check if the blog exists
        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found"
            });
        }
        // Check if the user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        // Save the comment
        await comment.save();
        // Add the comment to the blog
        blog.comments.push(comment._id);
        await blog.save();
        // Add the comment to the user
        user.comments.push(comment._id);
        await user.save();
        res.status(201).json({
            success: true,
            message: "Comment added successfully",
            data: comment
        });
    }
    catch (error) {
        next(error);
    }
};