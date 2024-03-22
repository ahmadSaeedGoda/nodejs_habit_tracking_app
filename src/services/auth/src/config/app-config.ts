import dotenv from 'dotenv';

dotenv.config();

function getRequiredEnvVar(key: string): string {
    const value = process.env[key];
    if (!value) {
        throw new Error(`${key} environment variable is not defined.`);
    }
    return value;
}

export const requiredEnvVars = {
    appPort: getRequiredEnvVar('APP_PORT'),
    dbURL: getRequiredEnvVar('DB_URL'),
};
