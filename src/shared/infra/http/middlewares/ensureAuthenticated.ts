import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

import User from '@modules/users/infra/typeorm/entities/User';
import authConfig from '@config/auth';

import AppError from '../../../errors/AppError';

interface ITokenPayload {
  user: User;
  iat: number;
  exp: number;
  sub: string;
}

export default function ensureAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new AppError('JWT token is missing', 401);
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = verify(token, authConfig.jwt.secret);

    const { user } = decoded as ITokenPayload;

    req.user = user;

    return next();
  } catch (err) {
    throw new AppError('Invalid JWT token', 401);
  }
}
