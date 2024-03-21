import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import fs from 'fs'
import { AuthRepository, authRepository } from './auth.repository';
import { User } from '../entity/auth.model';
import { requiredEnvVars } from '../config/app-config';
import { ValidationError } from '../errors/customErrors';
import { Validator } from '../utils/validator';
import path from 'path';

export class AuthService {
    constructor(
        private readonly authRepository: AuthRepository,
    ) {}

    login = async (user: Partial<User>): Promise<string> => {
        const validationResult = Validator.validateLoginCreds(user);

        if (validationResult.error) {
            throw validationResult.error;
        }

        const existingUser = await this.authRepository.getUserByEmail(user.email as string);

        if (!existingUser || !bcrypt.compareSync(user.password as string, existingUser?.password as string)) {
            throw new ValidationError('Invalid credentials');
        }

        return this.generateToken(existingUser.id as number);
    }

    generateToken(userId: number): string {
        const filePath = path.resolve(__dirname, '../../certs/private.pem');
        console.log('Attempting to read private key from:', filePath);
        const privateKey = fs.readFileSync(filePath, 'utf8');

        return jwt.sign({ userId }, privateKey, { algorithm: 'RS256' });
    }

    register = async (user: User): Promise<User> => {
        delete user.id;
        const validationResult = Validator.validateUser(user);

        if (validationResult.error) {
            throw validationResult.error;
        }

        const existingUser = await this.authRepository.getUserByEmail(user.email);

        if (existingUser) {
            throw new ValidationError('Email is already taken');
        }

        return await this.authRepository.saveUser(user);
    };
}

export const authService = new AuthService(authRepository);
