import { NextFunction, Request, Response } from 'express';
import { NotFoundError, ValidationError } from '../errors/customErrors';

export const errorHandler = (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
): void => {

    // Log the error
    console.error(error);

    // Check for custom error types and handle accordingly
    if (error instanceof ValidationError) {
        res.status(400).json({ message: error.message, details: error.details });
    } else if (error instanceof NotFoundError) {
        res.status(404).json({ message: error.message, });
    } else {
        res.status(500).json({ message: 'Something went wrong!' });
    }
};
