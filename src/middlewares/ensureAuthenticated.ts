import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

import User from '../models/User';

import authConfig from '../config/auth';

interface TokenPayload {
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
    throw new Error('JWT token is missing');
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = verify(token, authConfig.jwt.secret);

    const { user } = decoded as TokenPayload;

    req.user = user;

    return next();
  } catch (err) {
    throw new Error('Invalid JWT token');
  }
}
