import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import path from 'path';

// Load environment variables FIRST (resolve .env relative to server root, not cwd)
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

import connectDB from './config/db';
import connectMessagesDB from './config/messagesDb';
import { errorHandler, notFound } from './middleware/errorHandler';
import adminRoutes from './routes/admin';
import serviceRoutes from './routes/service';
import smsRoutes from './routes/sms';
import userRoutes from './routes/user';

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to both MongoDB databases
connectDB();
connectMessagesDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Health check
app.get('/api/health', (_req, res) => {
  res.json({
    success: true,
    message: 'IndusInd Bank API Server is running',
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/sms', smsRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`\n🏦 IndusInd Bank API Server`);
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`   Port: ${PORT}`);
  console.log(`   URL: http://localhost:${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/api/health\n`);
});

export default app;
