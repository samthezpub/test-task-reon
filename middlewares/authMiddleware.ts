import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { dotenvConfig } from "../dotenvConfig";

const secretKey = dotenvConfig.parsed?.JWT_SECRET_KEY || "shhh";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header("Authorization")?.split(" ")[1]; // Берём токен из заголовка

    if (!token) {
        return res.status(401).send({ message: "Access denied. No token provided.", status: "Access denied", code: 401 });
    }

    try {
        const decoded = jwt.verify(token, secretKey);
        // @ts-ignore
        req.user = decoded; // Передаём данные о пользователе в `req.user`
        next(); // Передаём управление дальше
    } catch (error) {
        return res.status(403).send({ message: "Invalid token", status: "Access denied", code: 403 });
    }
};

export const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
    return authMiddleware(req, res, () => {
        // @ts-ignore
        if (req.user.role !== "admin") {
            return res.status(403).send({ message: "Access denied. You are not admin.", status: "Access denied", code: 403 });
        }
        next();
    });
};
