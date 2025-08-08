// server.js
import express from 'express';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.route.js';
import { ClerkExpressWithAuth } from '@clerk/clerk-sdk-node';
import dotenv from 'dotenv';
import cors from 'cors';
import axios from 'axios';

dotenv.config();

const app = express();
app.use(express.json());

app.use(cors({
  origin: 'http://localhost:5173',  // frontend origin
  credentials: true
}));

// Middleware
app.use(ClerkExpressWithAuth());
app.use("/api", csvRoute);
app.use('/api/auth', authRoutes);

// Start HTTP server
const PORT = 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running on http://127.0.0.1:${PORT}`);
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB connected');
}).catch(err => {
  console.error('DB connection error:', err);
});
