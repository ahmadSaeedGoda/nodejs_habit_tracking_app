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
    pgHost: getRequiredEnvVar('POSTGRES_HOST'),
    pgPort: getRequiredEnvVar('POSTGRES_PORT'),
    pgUser: getRequiredEnvVar('POSTGRES_USER'),
    pgPass: getRequiredEnvVar('POSTGRES_PASSWORD'),
    pgDB: getRequiredEnvVar('POSTGRES_DB'),
};
