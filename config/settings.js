import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

export const BASE_URL = process.env.BASE_URL;
export const LOGIN_USERNAME = process.env.LOGIN_USERNAME;
export const LOGIN_PASSWORD = process.env.LOGIN_PASSWORD;
