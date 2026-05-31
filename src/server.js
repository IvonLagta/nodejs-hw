import 'dotenv/config';
import { errors } from 'celebrate';
import cors from 'cors';
import express from 'express';
import connectMongoDB from './db/connectMongoDB.js';
import notesRouter from './routes/notesRoutes.js';
import logger from './middleware/logger.js';
import notFoundHandler from './middleware/notFoundHandler.js';
import errorHandler from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(logger);

app.use('/notes', notesRouter);

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
