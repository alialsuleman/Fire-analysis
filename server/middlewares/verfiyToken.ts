import { verify1 } from '../auth/JWT/Verify';
import { AppError } from '../utils/appError';
import { SUCCESS, ERROR, FAIL } from '../utils/httpstatusText';
import { Request, Response, NextFunction } from 'express'
import { db } from '../dataStore';
import { UserController } from '../controllers/user.controllers';

export const verfiyToken =
    (req: Request, res: Response, next: NextFunction) => {
        const authHeader = req.headers['Authorization'] || req.headers['authorization'];
        if (!authHeader) {
            const error = new AppError('token is required', 401, FAIL);
            return next(error);
        }
        // @ts-ignore
        const token: string = authHeader.split(' ')[1];
        //console.log(token + "tttt")
        const ver = verify1(token);
        // console.log('ver ', ver);
        if (ver == null) {
            const error = new AppError('invaliad token', 401, FAIL);
            return next(error);
        }
        res.locals.user = ver;
        next();
    }

