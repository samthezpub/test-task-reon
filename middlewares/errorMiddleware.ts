import {NextFunction, Request, Response} from "express";

export function errorMiddleware(error:any, req:Request, res:Response, next:NextFunction) {
    res.status(500).send({error: error.message, path:req.url, status:"Internal server error" ,code: 500});
}