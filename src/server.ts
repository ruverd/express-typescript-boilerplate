import 'reflect-metadata';

import express, { Request, Response, NextFunction, response } from 'express';

import 'express-async-errors';
import routes from './routes';
import AppError from './errors/AppError';

import './database';

const app = express();

app.use(express.json());
app.use(routes);

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
