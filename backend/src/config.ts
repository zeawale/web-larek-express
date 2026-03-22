import dotenv from 'dotenv';

dotenv.config();

export const {
  PORT = 3000,
  DB_ADDRESS = 'mongodb://127.0.0.1:27017/weblarek',
  ORIGIN_ALLOW = 'http://localhost:5173',
  UPLOAD_PATH = 'images',
  UPLOAD_PATH_TEMP = 'temp',
} = process.env;
