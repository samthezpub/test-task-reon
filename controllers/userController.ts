import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {Request, Response} from "express";
import {User} from "@prisma/client";
import prisma from "../prisma/prisma";
import {dotenvConfig} from "../dotenvConfig";

const secretKey = dotenvConfig.parsed?.JWT_SECRET_KEY || 'shhh';


export class UserController {
    public static async registerUser(req: Request, res: Response) {
        const {username, password, role} = req.body;

        const password_hashed = await bcrypt.hash(password, 10);
        console.log(password_hashed);

        try{
            const user = await prisma.user.create({data: {username, password_hashed:password_hashed, role}});
            const token = jwt.sign(user, secretKey);
            res.send({message: 'User created', jwt: token, status:"ok", code:200});
        }catch (e) {
            res.send({message: 'User already exists', status: "error", code: 403});
        }
    }

    public static async authUser(req: Request, res: Response) {
        const { username, password } = req.body;

        const user = await prisma.user.findFirst({ where: { username } });
        if (!user) {
            return res.status(403).send({ message: 'Invalid user or password', status: "error", code: 403 });
        }

        if(user.archived){
            return res.status(403).send({ message: 'User has been deleted', status: "error", code: 403 });
        }

        // Проверяем пароль с хешем в базе
        const isPasswordValid = await bcrypt.compare(password, user.password_hashed);
        if (!isPasswordValid) {
            return res.status(403).send({ message: 'Invalid user or password', status: "Access denied", code: 403 });
        }

        const token = jwt.sign(user, secretKey);
        res.send({ message: 'User logged in', jwt: token, status: "ok", code: 200 });
    }

    public static async deleteUser(req: Request, res: Response) {
        const {id}: User = req.body;

        try{
            await prisma.user.update({where: {id}, data: {archived: true}});
            res.send({message: 'User deleted', status:"ok", code:200});
        }catch (e) {
            res.send({message: 'User not found', status: "Not found", code: 404});
        }

    }

}