// Custom error class
export class ApiError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
    }
}

// Error handling middleware
export const errorHandler = (err, req, res, next) => {
    console.error(err); // Log the error for debugging

    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message
        });
    }

    // Handle Mongoose validation errors
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            success: false,
            message: Object.values(err.errors).map(error => error.message)
        });
    }

    // Handle Mongoose duplicate key errors (E11000)
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        return res.status(400).json({
            success: false,
            message: `Duplicate value entered for ${field}, please use a different value.`
        });
    }

    // Handle invalid JSON syntax errors
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({
            success: false,
            message: 'Invalid JSON payload'
        });
    }

    // Default error handler
    return res.status(500).json({
        success: false,
        message: 'Internal Server Error'
    });
};
