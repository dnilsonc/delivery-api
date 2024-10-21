import { Router } from 'express';

import { ProductsController } from '../controllers/ProductsController';
import { ensureAuthenticate } from '../middlewares/ensureAuthenticate';

const productRoutes = Router();
const controller = new ProductsController();

// Aplicando o middleware para garantir que apenas usuários autenticados possam acessar as rotas de produtos
productRoutes.use(ensureAuthenticate);

// Definindo as rotas de produtos
productRoutes.get('/list', controller.list);           // Lista todos os produtos
productRoutes.get('/show/:id', controller.show);       // Mostra um produto específico com base no ID
productRoutes.post('/create', controller.create);      // Cria um novo produto
productRoutes.put('/update/:id', controller.update);   // Atualiza um produto existente com base no ID
productRoutes.delete('/delete/:id', controller.delete);// Deleta um produto existente com base no ID

export { productRoutes };
