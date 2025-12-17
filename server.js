import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/database.js';
dotenv.config()
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.use(express.static(path.join(__dirname, 'public')));

connectDB()
const PORT = 3000;
app.listen(PORT,()=>{
    console.log(`server is running http://localhost:${PORT}`);
    
})