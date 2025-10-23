import dotenv from "dotenv";
dotenv.config();
export const PORT = process.env.PORT || 8080;
export const JWT_SECRET = process.env.JWT_SECRET;
export const SQL_URL = process.env.SQL_URL;
export const MONGO_URL = process.env.MONGO_URL;
export const CORS_ORIGIN = process.env.CORS_ORIGIN || "*";
