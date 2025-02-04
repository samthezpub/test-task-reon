import {NextFunction, Request, Response} from "express";

export const validateBodyMiddleware = (req: Request, res: Response, next: NextFunction) => {
    if (req.method === "POST" && (!req.body || Object.keys(req.body).length === 0)) {
        return res.status(400).send({ message: "Request body is required", status: "error", code: 400 });
    }
    next();
};