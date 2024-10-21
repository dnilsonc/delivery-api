import { Request, Response } from 'express';
import { prismaC } from '../prisma'
import { AppError } from '../errors/AppError';
import Zod from 'zod';
import { hash } from 'bcrypt'
import { excludeFields } from '../utils/excludeFields';

export class UsersController {
    public async create(request: Request, response: Response) {
        const bodySchema = Zod.object({
            name: Zod.string().min(3),
            email: Zod.string().email(),
            password: Zod.string().min(3),
            password_confirmation: Zod.string().min(3),
        })
        .strict()
        .refine((data) => data.password === data.password_confirmation, {
            message: "Passwords don't match",
            path: ["password_confirmation"],
        });
        

        const {name, email, password} = bodySchema.parse(request.body);

        const userExists = await prismaC.user.findUnique({
            where: { email },
        });

        if(userExists){
            throw new AppError('User already registered', 409);
        }

        const passwordHash = await hash(password, 6);

        const user = await prismaC.user.create({
            data: { 
                name,
                email,
                passwordHash,
             },
        });

        return response.status(200).json(excludeFields(user, ['passwordHash']));
    }

    public async list(_request: Request, response: Response) {

        const users = await prismaC.user.findMany();

        const usersWithoutPassword = users.map((user) => {
            return excludeFields(user, ['passwordHash'])
        })

        return response.status(200).json(usersWithoutPassword);
    }

    public async show(request: Request, response: Response) {

        const { id } = request.params;

        const user = await prismaC.user.findUnique({
            where: { id },
        });

        if(!user){
            throw new AppError('User not found', 404);
        }

        return response.status(200).json(excludeFields(user, ['passwordHash']));
    }

    public async update(request: Request, response: Response) {
        const bodySchema = Zod.object({
            name: Zod.string().min(3).nullish(),
            email: Zod.string().email().nullish(),
        }).strict();

        const {name, email} = bodySchema.parse(request.body);
        const { id } = request.params

        const userExists = await prismaC.user.findUnique({
            where: { id },
        });

        if(!userExists){
            throw new AppError('User not found', 404);
        }

        let data = {};

        if(name) data = { name };
        if(email) data = { ...data, email };
        
        const user = await prismaC.user.update({
            where: { id },
            data
        });

        return response.status(200).json(excludeFields(user, ['passwordHash']));
    }

    public async delete(request: Request, response: Response) {

        const { id } = request.params;

        const user = await prismaC.user.findUnique({
            where: { id },
        });

        if(!user){
            throw new AppError('User not found', 404);
        }

        await prismaC.user.delete({
            where: { id },
        });

        return response.status(204).json();
    }
}
