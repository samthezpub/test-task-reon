import {Request,Response} from "express";
import prisma from "../prisma/prisma";

/* @swagger
 * tags:
 *   - name: Tasks
 *     description: Task management operations
 */


export class TaskController{
    /**
     * @swagger
     * /tasks:
     *   post:
     *     summary: Create a new task
     *     tags: [Tasks]
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
     *               responsibleId:
     *                 type: integer
     *               deadline:
     *                 type: string
     *                 format: date
     *               projectId:
     *                 type: integer
     *     responses:
     *       200:
     *         description: Task created successfully
     *       404:
     *         description: ResponsibleId or ProjectId Not found
     */
    public static async createTask(req:Request,res:Response){
        const {name, description, responsibleId, deadline, projectId} = req.body;
        const formattedDeadline = new Date(deadline).toISOString();

        try {
            await prisma.task.create({data:{name, description, responsible:{connect:{id:responsibleId}}, deadline:formattedDeadline, projectId}});
            res.send({message: 'Task created', status:"ok", code:200});
        }
        catch (e) {
            res.status(404).send({message: 'ResponsibleId or ProjectId Not found', status:"Not Found", code:404});
        }
    }

    /**
     * @swagger
     * /tasks/add-user:
     *   post:
     *     summary: Add a user to a task
     *     tags: [Tasks]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               taskId:
     *                 type: integer
     *               userId:
     *                 type: integer
     *     responses:
     *       200:
     *         description: User added to task
     *       404:
     *         description: User not found
     */
    public static async addUserToTask(req:Request,res:Response){
        const {taskId, userId} = req.body;

        try{
            await prisma.task.update({where:{id:taskId},data:{responsible:{connect:{id:userId}}}});
            res.send({message: 'User added to task', status:"ok", code:200});
        }catch (e) {
            res.send({message: 'User not found', status:"Not Found", code:404});
        }
    }

    /**
     * @swagger
     * /tasks/remove-user:
     *   post:
     *     summary: Remove a user from a task
     *     tags: [Tasks]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               taskId:
     *                 type: integer
     *               userId:
     *                 type: integer
     *     responses:
     *       200:
     *         description: User removed from task
     *       404:
     *         description: UserId or taskId not found
     */
    public static async deleteUserFromTask(req:Request,res:Response){
        const {taskId, userId} = req.body;

        try{
            await prisma.task.update({where:{id:taskId},data:{responsible:{disconnect:{id:userId}}}});
            res.send({message: 'User deleted from task', status:"ok", code:200});
        }catch (e) {
            res.status(404).send({message: 'UserId or taskId not found', status:"Not Found", code:404});
        }
    }

    /**
     * @swagger
     * /tasks/status:
     *   post:
     *     summary: Update the status of a task
     *     tags: [Tasks]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               id:
     *                 type: integer
     *     responses:
     *       200:
     *         description: Task status updated successfully
     *       404:
     *         description: Task not found
     */
    public static async updateStatus(req:Request,res:Response){
        const {id} = req.body;

        try{
            const task = await prisma.task.findUnique({where:{id}});
            const newStatus = task?.status;
            const statusInverted = !newStatus;

            await prisma.task.update({where:{id},data:{status:statusInverted}});
        } catch (e) {
            res.status(404).send({message: 'Task not found', status:"Not Found", code:404});
        }

        res.send({message: 'Task status updated', status:"ok", code:200});
    }

    /**
     * @swagger
     * /tasks/deadline:
     *   post:
     *     summary: Update the deadline of a task
     *     tags: [Tasks]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               id:
     *                 type: integer
     *               deadline:
     *                 type: string
     *                 format: date
     *     responses:
     *       200:
     *         description: Task deadline updated successfully
     *       404:
     *         description: Task not found
     */
    public static async updateDeadline(req:Request,res:Response){
        const {id, deadline} = req.body;
        const formattedDeadline = new Date(deadline).toISOString();

        try{
            await prisma.task.update({where:{id},data:{deadline:formattedDeadline}});
            res.send({message: 'Task deadline updated', status:"ok", code:200});
        } catch (e) {
            res.status(404).send({message: 'Task not found', status:"Not Found", code:404});
        }
    }

    /**
     * @swagger
     * /tasks/project:
     *   post:
     *     summary: Update the project of a task
     *     tags: [Tasks]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               id:
     *                 type: integer
     *               newProjectId:
     *                 type: integer
     *     responses:
     *       200:
     *         description: Task project updated successfully
     *       404:
     *         description: TaskId or newProjectId not found
     */
    public static async updateProject(req:Request,res:Response){
        const {id, newProjectId} = req.body;

        try{
            await prisma.task.update({where:{id},data:{projectId:newProjectId}});
            res.send({message: 'Task project updated', status:"ok", code:200});
        } catch (e) {
            res.status(404).send({message: 'TaskId or newProjectId not found', status:"Not Found", code:404});
        }
    }

    /**
     * @swagger
     * /tasks/delete:
     *   post:
     *     summary: Archive a task (delete it logically)
     *     tags: [Tasks]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               id:
     *                 type: integer
     *     responses:
     *       200:
     *         description: Task archived successfully
     *       404:
     *         description: TaskId not found
     */
    public static async deleteTask(req:Request,res:Response){
        const {id} = req.body;

        try{
            await prisma.task.update({where:{id},data:{archived:true}});
            res.send({message: 'Task deleted', status:"ok", code:200});
        } catch (e) {
            res.status(404).send({message: 'TaskId not found', status:"Not Found", code:404});
        }
    }
}

