import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import { errors } from 'celebrate';
import { PORT, DB_ADDRESS } from './config';
import productRouter from './routes/product';
import errorHandler from './middlewares/error';
import { requestLogger, errorLogger } from './middlewares/logger';
import orderRouter from './routes/order';

const app = express();

app.use(requestLogger);

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, '../public')));
app.use('/product', productRouter);
app.use('/order', orderRouter);

app.use('*', (_req, res) => {
  res.status(404).send({ message: 'Route not found' });
});

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

mongoose.connect(DB_ADDRESS)
  .then(() => console.log('MongoDB connected'))
  .catch(console.error);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
