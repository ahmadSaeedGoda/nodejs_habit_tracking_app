import axios from 'axios';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { Response, NextFunction } from 'express';
import { AuthRequest } from '../utils/authRequest.interface';
import { requiredEnvVars } from '../config/app-config';

let publicKey: string;

async function fetchPublicKey(url: string): Promise<string> {
  try {
    const response = await axios.get<{ publicKey: string }>(url);
    return response.data.publicKey;
  } catch (error) {
    console.error('Error fetching public key:', error);
    throw new Error('Unable to fetch public key');
  }
}

export async function authorize(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
	if (!publicKey) {
		try {
			const AUTH_SERVICE_BASE_URL = requiredEnvVars.authBaseUrl;
			const AUTH_SERVICE_PORT = requiredEnvVars.authPort;
			const AUTH_SERVICE_PUBLIC_KEY_PATH = requiredEnvVars.authPubKeyEndpoint;
			const AUTH_SERVICE_URL = `${AUTH_SERVICE_BASE_URL}:${AUTH_SERVICE_PORT}/${AUTH_SERVICE_PUBLIC_KEY_PATH}`;

			publicKey = await fetchPublicKey(AUTH_SERVICE_URL);
		} catch (error) {
			res.status(500).json({ message: 'Internal server error' });
			return;
		}
	}

	let token = req.get("Authorization");

	if (!token) {
		res.status(401).json({ message: 'No token provided' });
		return;
	}

	if (token && token.startsWith('Bearer ')) {
		token = token.split(' ')[1];
	} else {
		res.status(401).json({ message: 'Invalid token' });
		return;
	}

	jwt.verify(token, publicKey, { algorithms: ['RS256'] }, function(err, decoded) {
		if (err) {
			console.error('Error verifying token:', err.message);
			res.status(401).send('Unauthorized');
			return
		}

		if (decoded) {
			const decodedPayload = decoded as JwtPayload;
    		req.userId = decodedPayload.userId;
			// User is authorized, continue to next middleware or route handler
			next();
		}
	});
}
