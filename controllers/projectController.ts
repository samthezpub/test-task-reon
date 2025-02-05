import { Request, Response } from "express";
import prisma from "../prisma/prisma";

export class ProjectController {

    /**
     * @swagger
     * /projects/create:
     *   post:
     *     summary: Создать новый проект
     *     description: Создает новый проект и добавляет создателя в участники.
     *     tags: [Projects]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               name:
     *                 type: string
     *               description:
     *                 type: string
     *               creatorId:
     *                 type: string
     *     responses:
     *       200:
     *         description: Проект успешно создан
     *       400:
     *         description: Неверные данные
     */
    public static async createProject(req: Request, res: Response) {
        try {
            const { name, description, creatorId } = req.body;
            const newProject = await prisma.project.create({ data: { name, description, creatorId } });

            await prisma.project.update({ where: { id: newProject.id }, data: { members: { connect: { id: creatorId } } } });

            res.send({ message: "Project created", status: "ok", code: 200 });
        } catch (error) {
            res.status(400).send({ message: "Invalid request data", status: "error", code: 400 });
        }
    }

    /**
     * @swagger
     * /projects/update:
     *   post:
     *     summary: Обновить данные проекта
     *     description: Обновляет название и описание проекта по ID.
     *     tags: [Projects]
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
     *               name:
     *                 type: string
     *               description:
     *                 type: string
     *     responses:
     *       200:
     *         description: Проект обновлен
     *       404:
     *         description: Проект не найден
     */
    public static async updateProject(req: Request, res: Response) {
        try {
            const { id, name, description } = req.body;

            const newProject = await prisma.project.update({ where: { id }, data: { name, description } });

            res.send({ message: "Project updated", project: newProject, status: "ok", code: 200 });
        } catch (error) {
            res.status(404).send({ message: "Project not found", status: "error", code: 404 });
        }
    }

    /**
     * @swagger
     * /projects/delete:
     *   post:
     *     summary: Удалить проект
     *     description: Помечает проект как архивный.
     *     tags: [Projects]
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
     *         description: Проект удален
     *       404:
     *         description: Проект не найден
     */
    public static async deleteProject(req: Request, res: Response) {
        try {
            const { id } = req.body;

            await prisma.project.update({ where: { id }, data: { archived: true } });

            res.send({ message: "Project deleted", status: "ok", code: 200 });
        } catch (error) {
            res.status(404).send({ message: "Project not found", status: "error", code: 404 });
        }
    }

    /**
     * @swagger
     * /projects/addUser:
     *   post:
     *     summary: Добавить пользователя в проект
     *     description: Добавляет пользователя в список участников проекта.
     *     tags: [Projects]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               projectId:
     *                 type: string
     *               userId:
     *                 type: string
     *     responses:
     *       200:
     *         description: Пользователь добавлен
     *       404:
     *         description: Проект или пользователь не найдены
     */
    public static async addUserToProject(req: Request, res: Response) {
        try {
            const { projectId, userId } = req.body;

            await prisma.project.update({ where: { id: projectId }, data: { members: { connect: { id: userId } } } });

            res.send({ message: "User added to project", status: "ok", code: 200 });
        } catch (error) {
            res.status(404).send({ message: "Project or user not found", status: "error", code: 404 });
        }
    }

    /**
     * @swagger
     * /projects/deleteUser:
     *   post:
     *     summary: Удалить пользователя из проекта
     *     description: Удаляет пользователя из списка участников проекта.
     *     tags: [Projects]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               projectId:
     *                 type: string
     *               userId:
     *                 type: string
     *     responses:
     *       200:
     *         description: Пользователь удален
     *       404:
     *         description: Проект или пользователь не найдены
     */
    public static async deleteUserFromProject(req: Request, res: Response) {
        try {
            const { projectId, userId } = req.body;

            await prisma.project.update({ where: { id: projectId }, data: { members: { disconnect: { id: userId } } } });

            res.send({ message: "User removed from project", status: "ok", code: 200 });
        } catch (error) {
            res.status(404).send({ message: "Project or user not found", status: "error", code: 404 });
        }
    }
}
