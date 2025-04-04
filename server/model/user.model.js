import mongoose, { Schema } from "mongoose";
import bcrypt from 'bcryptjs';

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    },
    phone_number: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    bio: {
        type: String,
        trim: true,
        maxLength: [500, "bio can't be more than 500 characters"]// validation
    },
    userProfilePicture: {
        type: String
    },
    videos: [{
        type: Schema.Types.ObjectId,
        ref: 'Video'
    }]
}, {
    timestamps: true
});

userSchema.pre('save', function (next) {
    const user = this;
    if (user.isModified('password')) {
        bcrypt.hash(user.password, 10, (err, hash) => {
            if (err) {
                return next(err);
            }
            user.password = hash;
            next();
        });
    } else {
        next();
    }
});

userSchema.methods.comparePassword = async function (password) {
    const isMatch = await bcrypt.compare(password, this.password);
    return isMatch;
};





const User = mongoose.model('User', userSchema, 'users');

export default User;
