import express from 'express';
import fs from 'fs'
import cors from 'cors';
import { requiredEnvVars } from './config/app-config';
import bodyParser from 'body-parser';
import { errorHandler } from './middleware/errorHandler';
import authRouter from './routes/routes';

const app = express();
// Allow requests from any origin
app.use(cors());

const publicKey = fs.readFileSync('./certs/public.pem', 'utf8');

app.get('/public-key', (req, res) => {
  res.json({ publicKey });
});

app.use(bodyParser.json());

app.use('/auth', authRouter);

app.use(errorHandler);

const port = requiredEnvVars.appPort;

app.listen(port, () => {
  console.log(`Authentication service is running on http://localhost:${port}`);
});
