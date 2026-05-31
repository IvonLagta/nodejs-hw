import 'dotenv/config';
import path from 'node:path';
import { errors } from 'celebrate';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import pinoHttp from 'pino-http';
import connectMongoDB from './db/connectMongoDB.js';
import notesRouter from './routes/notesRoutes.js';
import authRouter from './routes/authRoutes.js';
import userRouter from './routes/userRoute.js';
import notFoundHandler from './middleware/notFoundHandler.js';
import errorHandler from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(pinoHttp());
app.use('/uploads', express.static(path.resolve('uploads')));

app.get('/', (req, res) => {
  res.send('Express server is running');
});

app.use('/auth', authRouter);
app.use('/notes', notesRouter);
app.use('/users', userRouter);

app.get('/test-error', () => {
  throw new Error('Simulated server error');
});

app.use(errors());
app.use(notFoundHandler);
app.use(errorHandler);

const bootstrap = async () => {
  await connectMongoDB();

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

bootstrap();
