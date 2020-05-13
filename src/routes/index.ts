import { Router } from 'express';
import appointmentRouter from './appointments.routes';

const routes = Router();

routes.get('/test', (req, res) => {
  return res.json({
    message: 'teste',
  });
});

routes.use('/appointments', appointmentRouter);

export default routes;
