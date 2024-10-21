import { Request, Response } from 'express';
import { prismaC } from '../prisma';
import { AppError } from '../errors/AppError';
import Zod from 'zod';

export class ProductsController {
    // Método para criar um novo produto
    public async create(request: Request, response: Response) {
        const bodySchema = Zod.object({
            name: Zod.string().min(3),
            price: Zod.number().positive(),
        }).strict();

        const { name, price } = bodySchema.parse(request.body);

        console.log('Creating a new product:', name);

        const product = await prismaC.product.create({
            data: {
                name,
                price,
            },
        });

        return response.status(201).json(product);
    }

    // Método para listar todos os produtos
    public async list(_request: Request, response: Response) {
        console.log('Listing all products');

        const products = await prismaC.product.findMany();

        return response.status(200).json(products);
    }

    // Método para mostrar um produto específico
    public async show(request: Request, response: Response) {
        const { id } = request.params;

        console.log('Fetching product with id:', id);

        const product = await prismaC.product.findUnique({
            where: { id },
        });

        if (!product) {
            throw new AppError('Product not found', 404);
        }

        return response.status(200).json(product);
    }

    // Método para atualizar um produto existente
    public async update(request: Request, response: Response) {
        const bodySchema = Zod.object({
            name: Zod.string().min(3).nullish(),
            price: Zod.number().positive().nullish(),
        }).strict();

        const { name, price } = bodySchema.parse(request.body);
        const { id } = request.params;

        console.log('Updating product with id:', id);

        const productExists = await prismaC.product.findUnique({
            where: { id },
        });

        if (!productExists) {
            throw new AppError('Product not found', 404);
        }

        const data = {
            ...(name && { name }),
            ...(price && { price }),
        };

        const product = await prismaC.product.update({
            where: { id },
            data,
        });

        return response.status(200).json(product);
    }

    // Método para deletar um produto existente
    public async delete(request: Request, response: Response) {
        const { id } = request.params;

        console.log('Deleting product with id:', id);

        const product = await prismaC.product.findUnique({
            where: { id },
        });

        if (!product) {
            throw new AppError('Product not found', 404);
        }

        await prismaC.product.delete({
            where: { id },
        });

        return response.status(204).json();
    }
}
