import express from 'express';
import mongoose from 'mongoose';
import contactRoutes from './routes/routes.js';
import path from 'path';
import { fileURLToPath } from 'url';  

const app = express();

app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'public')));

mongoose
  .connect('mongodb://127.0.0.1:27017/contactManagement')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error(err));

app.use('/api/contacts', contactRoutes);

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
