import {UserController} from "../controllers/userController";
import {Router} from "express";
import {adminMiddleware} from "../middlewares/authMiddleware";

const router = Router();

router.post('/registration', UserController.registerUser)

// @ts-ignore
router.post('/authentication', UserController.authUser)
// @ts-ignore
router.post('/delete',adminMiddleware , UserController.deleteUser)

export default router;