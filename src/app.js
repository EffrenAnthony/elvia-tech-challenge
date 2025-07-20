import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import conversationRouter from './routes/conversation.routes.js';

const app = express();

// Middlewares
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api', conversationRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Not Found' });
});

export default app;
