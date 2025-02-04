import {Router} from "express";
import {ProjectController} from "../controllers/projectController";
import {adminMiddleware, authMiddleware} from "../middlewares/authMiddleware";

const router = Router();

// @ts-ignore
router.post("/create", adminMiddleware, ProjectController.createProject);
// @ts-ignore
router.post("/update",adminMiddleware , ProjectController.updateProject);
// @ts-ignore
router.post('/delete',adminMiddleware, ProjectController.deleteProject);
// @ts-ignore
router.post('/addUser',adminMiddleware, ProjectController.addUserToProject);
// @ts-ignore
router.post('/deleteUser',adminMiddleware, ProjectController.deleteUserFromProject);

export default router;