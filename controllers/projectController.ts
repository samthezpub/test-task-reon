import { Request, Response } from "express";
import { Project } from "@prisma/client";
import prisma from "../prisma/prisma";

export class ProjectController {
    public static async createProject(req: Request, res: Response) {
        try {
            const { name, description, creatorId }: Project = req.body;
            const newProject = await prisma.project.create({ data: { name, description, creatorId } });

            await prisma.project.update({ where: { id: newProject.id }, data: { members: { connect: { id: creatorId } } } });

            res.send({ message: "Project created", status: "ok", code: 200 });
        } catch (error) {
            res.status(400).send({ message: "Invalid request data", status: "error", code: 400 });
        }
    }

    public static async updateProject(req: Request, res: Response) {
        try {
            const { id, name, description }: Project = req.body;

            const newProject = await prisma.project.update({ where: { id }, data: { name, description } });

            res.send({ message: "Project updated", project: newProject, status: "ok", code: 200 });
        } catch (error) {
            res.status(404).send({ message: "Project not found", status: "error", code: 404 });
        }
    }

    public static async deleteProject(req: Request, res: Response) {
        try {
            const { id }: Project = req.body;

            await prisma.project.update({ where: { id }, data: { archived: true } });

            res.send({ message: "Project deleted", status: "ok", code: 200 });
        } catch (error) {
            res.status(404).send({ message: "Project not found", status: "error", code: 404 });
        }
    }

    public static async addUserToProject(req: Request, res: Response) {
        try {
            const { projectId, userId } = req.body;

            await prisma.project.update({ where: { id: projectId }, data: { members: { connect: { id: userId } } } });

            res.send({ message: "User added to project", status: "ok", code: 200 });
        } catch (error) {
            res.status(404).send({ message: "Project or user not found", status: "error", code: 404 });
        }
    }

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
