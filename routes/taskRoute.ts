import {Router} from "express";
import {TaskController} from "../controllers/taskController";
import {adminMiddleware, authMiddleware} from "../middlewares/authMiddleware";


const router = Router();

// @ts-ignore
router.post("/create",authMiddleware, TaskController.createTask)
// @ts-ignore
router.post('/addUser',authMiddleware, TaskController.addUserToTask)
// @ts-ignore
router.post('/deleteUser',authMiddleware, TaskController.deleteUserFromTask)
// @ts-ignore
router.post('/updateStatus',authMiddleware, TaskController.updateStatus)
// @ts-ignore
router.post('/updateDeadline',authMiddleware, TaskController.updateDeadline)
// @ts-ignore
router.post('/updateProject',authMiddleware, TaskController.updateProject)
// @ts-ignore
router.post('/deleteTask',authMiddleware, TaskController.deleteTask)

export default router;