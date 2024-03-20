import { NextFunction, Request, Response } from 'express';
import { AuthService, authService } from './auth.service';
import { User, UserSafeResponseDTO } from '../entity/auth.model';

export class AuthController {
    constructor(private readonly authService: AuthService) {}

    register = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { name, email, password } = req.body;
            const user = new User()
            user.name = name;
            user.email = email;
            user.password = password;

            const createdUser = await this.authService.register(user);

            // Create a UserSafeResponseDTO instance with non-sensitive data
            const userResponse: UserSafeResponseDTO = {
                id: createdUser.id as number,
                name: createdUser.name,
                email: createdUser.email
            };

            res.status(201).json(userResponse);
        } catch (error) {
            next(error);
        }
    }

    login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { email, password } = req.body;
            const token = await this.authService.login({ email, password });

            if (token) {
                res.json({ token });
            } else {
                res.status(401).json({ message: 'Invalid credentials' });
            }
        } catch (error) {
            next(error);
        }
    }
}
