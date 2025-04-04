import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
    blog_img_url: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comments'
    }],
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
}, { timestamps: true });

const Blog = mongoose.model("Blog", blogSchema);

export default Blog;