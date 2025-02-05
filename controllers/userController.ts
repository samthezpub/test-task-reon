import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import prisma from "../prisma/prisma";
import { dotenvConfig } from "../dotenvConfig";

const secretKey = dotenvConfig.parsed?.JWT_SECRET_KEY || 'shhh';

export class UserController {
    /**
     * @swagger
     * /users/registration:
     *   post:
     *     summary: Регистрация нового пользователя
     *     description: Создает нового пользователя и возвращает JWT токен.
     *     tags: [Users]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               username:
     *                 type: string
     *               password:
     *                 type: string
     *               role:
     *                 type: string
     *     responses:
     *       200:
     *         description: Пользователь создан
     *       403:
     *         description: Пользователь уже существует
     */
    public static async registerUser(req: Request, res: Response) {
        const { username, password, role } = req.body;
        const password_hashed = await bcrypt.hash(password, 10);
        try {
            const user = await prisma.user.create({ data: { username, password_hashed, role } });
            const token = jwt.sign(user, secretKey);
            res.send({ message: 'User created', jwt: token, status: "ok", code: 200 });
        } catch (e) {
            res.send({ message: 'User already exists', status: "error", code: 403 });
        }
    }

    /**
     * @swagger
     * /users/authentication:
     *   post:
     *     summary: Аутентификация пользователя
     *     description: Проверяет учетные данные пользователя и выдает JWT токен.
     *     tags: [Users]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               username:
     *                 type: string
     *               password:
     *                 type: string
     *     responses:
     *       200:
     *         description: Пользователь успешно вошел
     *       403:
     *         description: Неверное имя пользователя или пароль
     */
    public static async authUser(req: Request, res: Response) {
        const { username, password } = req.body;
        const user = await prisma.user.findFirst({ where: { username } });
        if (!user || user.archived) {
            return res.status(403).send({ message: 'Invalid user or password', status: "error", code: 403 });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password_hashed);
        if (!isPasswordValid) {
            return res.status(403).send({ message: 'Invalid user or password', status: "Access denied", code: 403 });
        }
        const token = jwt.sign(user, secretKey);
        res.send({ message: 'User logged in', jwt: token, status: "ok", code: 200 });
    }

    /**
     * @swagger
     * /users/delete:
     *   post:
     *     summary: Удаление пользователя
     *     description: Архивирует пользователя, помечая его как удаленного.
     *     tags: [Users]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               id:
     *                 type: string
     *     responses:
     *       200:
     *         description: Пользователь удален
     *       404:
     *         description: Пользователь не найден
     */
    public static async deleteUser(req: Request, res: Response) {
        const { id } = req.body;
        try {
            await prisma.user.update({ where: { id }, data: { archived: true } });
            res.send({ message: 'User deleted', status: "ok", code: 200 });
        } catch (e) {
            res.send({ message: 'User not found', status: "Not found", code: 404 });
        }
    }
}
