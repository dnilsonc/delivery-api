import { Router } from 'express';

import { OrdersController } from '../controllers/OrdersController';
import { ensureAuthenticate } from '../middlewares/ensureAuthenticate';

const ordersRoutes = Router();
const controller = new OrdersController();

// Aplicando o middleware para garantir que apenas usuários autenticados possam acessar as rotas
ordersRoutes.use(ensureAuthenticate);

// Definindo as rotas
ordersRoutes.get('/list', controller.list);
ordersRoutes.get('/show/:id', controller.show);
ordersRoutes.post('/create', controller.create);
ordersRoutes.put('/update/:id', controller.update);
ordersRoutes.delete('/delete/:id', controller.delete);

export { ordersRoutes };
