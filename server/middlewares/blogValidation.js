import { body, validationResult } from 'express-validator';

export const validateBlog = [
    body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required'),
    body('description')
    .trim()
    .notEmpty()
    .withMessage('Author is required'),

    // Validation middleware
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];