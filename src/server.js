import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import connectMongoDB from './db/connectMongoDB.js';
import { logger } from './middleware/logger.js';
import notesRouter from './routes/notesRoutes.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(logger);

app.get('/', (req, res) => {
  res.send('Express server is running');
});

app.use(notesRouter);

app.use(notFoundHandler);
app.use(errorHandler);

const bootstrap = async () => {
  await connectMongoDB();

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

bootstrap();
