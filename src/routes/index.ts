import { Router } from 'express';

import sessionsRouter from './sessions.routes';
import usersRouter from './users.routes';

const routes = Router();

routes.get('/test', (req, res) => {
  return res.json({
    message: 'teste',
  });
});

routes.use('/sessions', sessionsRouter);
routes.use('/users', usersRouter);

export default routes;
