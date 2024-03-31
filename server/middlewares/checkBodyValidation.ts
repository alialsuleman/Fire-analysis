import { validationResult } from "express-validator";
import { AppError } from "../utils/appError";
import { FAIL } from "../utils/httpstatusText";
import { Request, Response, NextFunction } from "express";


export const checkBodyValidation = (req: Request, res: Response, next: NextFunction) => {

    const errors: any = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new AppError(errors.array(), 400, FAIL)
        return next(error);
    }
    next();
}


