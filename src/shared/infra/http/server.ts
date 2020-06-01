import 'reflect-metadata';
import 'dotenv/config';

import express, { Request, Response, NextFunction, response } from 'express';
import cors from 'cors';
import { errors } from 'celebrate';
import 'express-async-errors';

import uploadConfig from '@config/upload';
import routes from './routes';
import AppError from '../../errors/AppError';

import '../typeorm';
import '../../container';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/files', express.static(uploadConfig.uploadsFolder));
app.use(routes);
app.use(errors);

app.use((err: Error, req: Request, res: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  console.error(err);

  return response.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
});

app.listen(3000, () => {
  console.error('🚀 Server started on port 3000!');
});
