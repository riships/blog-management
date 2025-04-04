import jwt from 'jsonwebtoken';
import User from "../model/user.model.js";
import { ApiError } from "../middlewares/errorHandler.js";

export const addUser = async (req, res, next) => {
    try {
        const { firstName, lastName, email, phone_number, password } = req.body;
        // Validate required fields
        if (!firstName || !lastName || !email || !password) {
            throw new ApiError(400, "All required fields must be provided");
        }

        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new ApiError(400, "Invalid email format");
        }

        // Strong password validation
        if (password.length < 6) {
            throw new ApiError(400, "Password must be at least 6 characters long");
        }

        const isUser = await User.findOne({ email });
        if (isUser) {
            throw new ApiError(409, "Email is already registered"); // 409 Conflict
        }

        const user = await User.create({
            userProfilePicture: `/${req.file.filename}`,
            firstName,
            lastName,
            email,
            phone_number,
            password
        });

        if (!user) {
            throw new ApiError(500, "Error creating user");
        }

        return res.status(201).json({
            success: true,
            message: "User created successfully"
        });

    } catch (error) {
        if (error.name === 'ValidationError') {
            return next(new ApiError(400, Object.values(error.errors).map(err => err.message).join(', ')));
        }
        return next(error instanceof ApiError ? error : new ApiError(500, "Error creating user"));
    }
};

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Validate required fields
        if (!email || !password) {
            throw new ApiError(400, "Email and password are required");
        }

        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new ApiError(400, "Invalid email format");
        }

        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            throw new ApiError(401, "Invalid email or password"); // Generic error for security
        }

        const isPasswordCorrect = await user.comparePassword(password);
        if (!isPasswordCorrect) {
            throw new ApiError(401, "Invalid email or password"); // Generic error for security
        }

        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.SECRET_KEY,
            { expiresIn: process.env.JWT_EXPIRE || "1h" }
        );

        // Remove password from response
        user.password = undefined;

        return res.status(200).json({
            success: true,
            message: "Logged in successfully",
            token,
            user: {
                id: user._id,
                userProfilePicture: user.userProfilePicture,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName
            }
        });

    } catch (error) {
        if (error instanceof ApiError) {
            return next(error);
        }
        if (error.name === 'JsonWebTokenError') {
            return next(new ApiError(500, "Error generating authentication token"));
        }
        return next(new ApiError(500, "Error during login"));
    }
};


export const getUserData = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return next(new ApiError(404, "User not found"));
        }
        return res.status(200).json({
            success: true,
            message: "User data retrieved successfully",
            user: {
                id: user._id,
                userProfilePicture: user.userProfilePicture,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName
            }
        });
    }
    catch (error) {
        if (error instanceof ApiError) {
            return next(error);
        }
        return next(new ApiError(500, "Error retrieving user data"));
    }
}
