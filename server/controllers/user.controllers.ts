import { RequestHandler } from 'express'
import { DataStore, initDb } from '../dataStore';
import { Comment, Like, Post, User } from '../types';
import crypto from 'crypto'
const { validationResult } = require('express-validator')
import { AppError } from '../utils/appError'
import { FAIL, SUCCESS } from '../utils/httpstatusText';
import { PayloadObj, createSign } from '../auth/JWT/createSign';
type createUserType = Pick<User, 'firstName' | 'lastName' | 'userName' | 'email' | 'password'>;
const bcrypt = require('bcryptjs')

//   complete send method 

export class UserController {

    private db: DataStore;
    private static UserController: any = null;

    constructor(db: DataStore) {
        this.db = db;
    }

    public static getUserController(db: DataStore) {
        if (this.UserController == null) {
            this.UserController = new UserController(db);
        }
        return this.UserController;
    }


    // create validation 
    public createAcount: RequestHandler<{}, {}, { firstName: string, lastName: string, userName: string, email: string, password: string }, {}> = async (req, res, next) => {
        const user1 = await this.db.getUserByEmail(req.body.email);
        const user2 = await this.db.getUserByUserName(req.body.userName);
        if (user1) {
            const error = new AppError('this email is exist', 400, FAIL)
            return next(error);
        }
        if (user2) {
            const error = new AppError('this username is exist', 400, FAIL)
            return next(error);
        }


        req.body.password = await bcrypt.hash(req.body.password, 10);
        const user: User = {
            id: crypto.randomUUID(),
            userName: req.body.userName,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password,
            coverPhoto: "",
            acountPhoto: ""
        }
        console.log(user);
        await this.db.createUser(user);
        res.status(202).json({
            status: SUCCESS,
            data: {
                user: "acount created please login😘"
            }
        });

    }


    public login: RequestHandler<{}, {}, { userName: string, password: string }, {}> = async (req, res, next) => {

        const user = await this.db.getUserByUserName(req.body.userName);
        if (!user) {
            const error = new AppError('this email is not exist', 400, FAIL)
            return next(error);
        }
        const password = req.body.password.toString();
        const matchedPassword = await bcrypt.compare(password, user.password);

        if (matchedPassword) {

            const obj: PayloadObj = {
                id: user.id,
                username: user.userName
            }

            const token = await createSign(obj);
            let expired = Date.now();
            expired += 30 * 24 * 60 * 1000;

            await this.db.addUserLogin({
                id: user.id,
                expired: expired
            });
            res
                .setHeader('Authorization', 'Bearer ' + token)
                .status(200)
                .json({
                    status: SUCCESS,
                    data: {
                        token: token
                    }
                });
        }
        else {
            const error = new AppError('wrong username  or  password', 400, FAIL)
            return next(error);
        }

    }
    public logOut: RequestHandler<{}, {}, { id: string }, {}> = async (req, res, next) => {
        await this.db.removeUserLogin(req.body.id);
        res.removeHeader('Authorization');
        res.status(202)
            .json({
                status: SUCCESS,
                data: {
                    user: "logout success😘"
                }
            });
    }
    public isLogin: RequestHandler<{}, {}, {}, {}> = async (req, res, next) => {
        const user = res.locals?.user;
        if (!user) {
            const error = new AppError('login please 😒', 400, FAIL)
            return next(error);
        }
        const exp = await this.db.getUserExpired(res.locals.user.id);
        if (exp > Date.now()) {
            // @ts-ignore
            req.body.id = res.locals.user.id;
            next();
        }
        else {
            await this.db.removeUserLogin(res.locals.user.id);
            const error = new AppError('login please 🤢', 400, FAIL)
            return next(error);
        }
    }



}











