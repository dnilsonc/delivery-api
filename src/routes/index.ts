import { Router } from "express";
import { authenticateRoutes } from "./authenticateRoutes";


import {usersRoutes} from './userRoutes'
import { ordersRoutes } from "./orderRoutes";
import { productRoutes } from "./productRoutes";

const routes = Router();

routes.use('/users', usersRoutes);
routes.use('/sessions', authenticateRoutes);

// GPT fez daqui pra frente

routes.use('/orders', ordersRoutes)

routes.use('/products', productRoutes)

export {routes}