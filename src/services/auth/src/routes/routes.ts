import express from 'express';
import { AuthController } from '../layers/auth.controller';
import { authService } from '../layers/auth.service';

const authRouter = express.Router();

const authController = new AuthController(authService);

authRouter.post('/login', authController.login);
authRouter.post('/register', authController.register.bind(authController));

export default authRouter;
