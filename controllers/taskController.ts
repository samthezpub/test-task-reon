import {Request,Response} from "express";
import prisma from "../prisma/prisma";
import {Task, User} from "@prisma/client";

export class TaskController{
    public static async createTask(req:Request,res:Response){
        const {name, description, responsibleId, deadline, projectId} = req.body;

        // Нужно для того чтобы дата без указания времени работала (2024-09-12).
        // В случае если передаётся строка ISO формата работает так же корректно
        const formattedDeadline = new Date(deadline).toISOString();

        try {
            await prisma.task.create({data:{name, description, responsible:{connect:{id:responsibleId}}, deadline:formattedDeadline, projectId}})

            res.send({message: 'Task created', status:"ok", code:200});
        }
        catch (e) {
            res.status(404).send({message: 'ResponsibleId or ProjectId Not found', status:"Not Found", code:404});
        }
    }

    public static async addUserToTask(req:Request,res:Response){
        const {taskId, userId} = req.body;

        try{
            await prisma.task.update({where:{id:taskId},data:{responsible:{connect:{id:userId}}}})
            res.send({message: 'User added to task', status:"ok", code:200});
        }catch (e) {
            res.send({message: 'User not found', status:"Not Found", code:404});
        }

    }

    public static async deleteUserFromTask(req:Request,res:Response){
        const {taskId, userId} = req.body;

        try{
            await prisma.task.update({where:{id:taskId},data:{responsible:{disconnect:{id:userId}}}})
            res.send({message: 'User deleted from task', status:"ok", code:200});
        }catch (e) {
            res.status(404).send({message: 'UserId or taskId not found', status:"Not Found", code:404});
        }

    }

    public static async updateStatus(req:Request,res:Response){
        const {id}:Task = req.body;

        // для того чтобы сменить статус задачи можно получить эту же задачу и инвентировать её статус

        try{
            const task = await prisma.task.findUnique({where:{id}});
            const newStatus = task?.status;
            const statusInverted = !newStatus;

            await prisma.task.update({where:{id},data:{status:statusInverted}})
        }
        catch (e) {
            res.status(404).send({message: 'Task not found', status:"Not Found", code:404});
        }

        res.send({message: 'Task status updated', status:"ok", code:200});
    }

    public static async updateDeadline(req:Request,res:Response){
        const {id, deadline}:Task = req.body;

        // Нужно для того чтобы дата без указания времени работала (2024-09-12).
        // В случае если передаётся строка ISO формата работает так же корректно
        const formattedDeadline = new Date(deadline).toISOString();

        try{
            await prisma.task.update({where:{id},data:{deadline:formattedDeadline}})
            res.send({message: 'Task deadline updated', status:"ok", code:200});
        }catch (e) {
            res.status(404).send({message: 'Task not found', status:"Not Found", code:404});
        }


    }

    public static async updateProject(req:Request,res:Response){
        const {id, newProjectId} = req.body;

        try{
            await prisma.task.update({where:{id},data:{projectId:newProjectId}})
            res.send({message: 'Task project updated', status:"ok", code:200});
        }
        catch (e) {
            res.status(404).send({message: 'TaskId or newProjectId not found', status:"Not Found", code:404});
        }
    }

    public static async deleteTask(req:Request,res:Response){
        const {id} = req.body;

        try{
            await prisma.task.update({where:{id},data:{archived:true}})

            res.send({message: 'Task deleted', status:"ok", code:200});
        }
        catch (e) {
            res.status(404).send({message: 'TaskId not found', status:"Not Found", code:404});
        }
    }
}
