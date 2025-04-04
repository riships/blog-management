import jwt from 'jsonwebtoken';
import { ApiError } from './errorHandler.js';

const secret = process.env.SECRET_KEY;

const verifyJwt = (req, res, next) => {
    const token = req.header('blog-auth-token');

    // check if token exists
    if (!token) {
        throw new ApiError(401, 'Access denied. No token provided.');
    }

    try {
        const decoded = jwt.verify(token, secret);

        // Check token expiration
        if (decoded.exp && decoded.exp * 1000 < Date.now()) {
            // Clear the expired cookie
            res.clearCookie('token', {
                httpOnly: true,
                sameSite: 'strict'
            });
            throw new ApiError(401, 'Session expired. Please log in again.');
        }

        req.user = decoded;
        next();
    } catch (error) {
        // Handle specific JWT errors
        if (error.name === 'JsonWebTokenError') {
            throw new ApiError(401, 'Invalid token format');
        } else if (error.name === 'TokenExpiredError') {
            // Clear the expired cookie
            res.clearCookie('token', {
                httpOnly: true,
                sameSite: 'strict'
            });
            throw new ApiError(401, 'Token has expired');
        }

        // If it's already an ApiError, throw it as is
        if (error instanceof ApiError) {
            throw error;
        }

        throw new ApiError(500, 'Internal server error during authentication');
    }
};

export default verifyJwt;