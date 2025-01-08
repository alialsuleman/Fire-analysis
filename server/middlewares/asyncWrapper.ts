import { NextFunction, Request, Response, RequestHandler } from "express";

export const asyncWrapper = (asycnFn: any) => {
    return (req: Request, res: Response, next: NextFunction) => {
        asycnFn(req, res, next).catch((err: Error) => {
            next(err);
        })
    }
}