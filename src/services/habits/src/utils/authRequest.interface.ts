import { Request } from 'express';

// Define a new interface that extends the Request interface
export interface AuthRequest extends Request {
	userId?: string;
}
