import mongoose from "mongoose";

const commentsSchema = mongoose.Schema({
    comment: {
        type: String,
        required: true,
        trim: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    blog: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blog'
    }
}, {
    timestamps: true
});

const Comments = mongoose.model('Comments', commentsSchema);
export default Comments;