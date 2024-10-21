import { Request, Response } from 'express';
import { prismaC } from '../prisma';
import { AppError } from '../errors/AppError';
import Zod from 'zod';

export class OrdersController {
    // Método para criar um novo pedido
    public async create(request: Request, response: Response) {
        const bodySchema = Zod.object({
            clientName: Zod.string().min(3),
            address: Zod.string().min(3),
            status: Zod.enum(['pending', 'in_progress', 'completed']).optional(),
        }).strict();

        const { clientName, address, status } = bodySchema.parse(request.body);

        const userId = request.userId as string ;

        console.log('Creating a new order for client:', clientName);

        const order = await prismaC.order.create({
            data: {
                clientName,
                address,
                status: status || 'pending',
                userId 
            },
        });

        return response.status(201).json(order);
    }

    // Método para listar todos os pedidos
    public async list(_request: Request, response: Response) {
        console.log('Listing all orders');

        const orders = await prismaC.order.findMany();

        return response.status(200).json(orders);
    }

    // Método para mostrar um pedido específico
    public async show(request: Request, response: Response) {
        const { id } = request.params;

        console.log('Fetching order with id:', id);

        const order = await prismaC.order.findUnique({
            where: { id },
        });

        if (!order) {
            throw new AppError('Order not found', 404);
        }

        return response.status(200).json(order);
    }

    // Método para atualizar um pedido existente
    public async update(request: Request, response: Response) {
        const bodySchema = Zod.object({
            clientName: Zod.string().min(3).nullish(),
            address: Zod.string().min(3).nullish(),
            status: Zod.enum(['pending', 'in_progress', 'completed']).nullish(),
        }).strict();

        const { clientName, address, status } = bodySchema.parse(request.body);
        const { id } = request.params;

        console.log('Updating order with id:', id);

        const orderExists = await prismaC.order.findUnique({
            where: { id },
        });

        if (!orderExists) {
            throw new AppError('Order not found', 404);
        }

        const data = {
            ...(clientName && { clientName }),
            ...(address && { address }),
            ...(status && { status }),
        };

        const order = await prismaC.order.update({
            where: { id },
            data,
        });

        return response.status(200).json(order);
    }

    // Método para deletar um pedido existente
    public async delete(request: Request, response: Response) {
        const { id } = request.params;

        console.log('Deleting order with id:', id);

        const order = await prismaC.order.findUnique({
            where: { id },
        });

        if (!order) {
            throw new AppError('Order not found', 404);
        }

        await prismaC.order.delete({
            where: { id },
        });

        return response.status(204).json();
    }
}
