import express, { NextFunction, Request, Response } from 'express';

import { Position } from './shared';
import { AppError } from './utils/appError';
import { ERROR } from './utils/httpstatusText';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { ANALYSER_DELAY, PORT } from './env';
import { postQueue } from './Queues/PostQueue';
import { Post } from './shared/post';



export function startServer() {


    const app = express();


    app.use(cors())
    app.use(cookieParser());
    app.use(express.json());











    //  get post from .... 
    app.post('/post/add', (req: Request<{ id: string }, {}, { id: string, position: Position, radius: number, createdAt: string, severity: number, confidence: number }, {}>, res: Response) => {

        // const post: Post = { type: "Post", ...req.body };
        //postQueue.add(post);
    });

    app.put('/post/:id', (req: Request<{ id: string }, {}, { confidence: number }, {}>, res: Response) => {
        const { id } = req.params;
        const { confidence } = req.body;
        // postQueue.add({ id, confidence });
    });

    app.get('/dec', (req, res) => {
        ANALYSER_DELAY[0] = 1;
        res.send({ message: 'OK !' });
    })



    app.get('/inc', (req, res) => {
        ANALYSER_DELAY[0] = 100000;
        res.send({ message: 'OK !' });
    })



    app.get('/postQueue', (req, res) => {
        //  postQueue.add({ type: "UpdatePost", id: "123", confidence: 123123 })
        res.send(postQueue.display());

    })





    app.get('*', (req, res) => {

        res.send({ message: 'Welcome to api!' });
    });





    app.all('*', (req, res, next) => {
        return res.status(404).json({
            status: ERROR,
            data: null,
            message: "this resource not available"
        });
    })


    //global middleware for error handler 
    app.use((error: AppError, req: Request, res: Response, next: NextFunction) => {
        console.log("error ", error.message);
        return res.status(error.statusCode || 500).json({
            status: error.statusText || "ERROR",
            data: null,
            message: error.message,
            code: error.statusCode || 500
        });
    })



    const server = app.listen(PORT, () => console.log(`server Running in port 3000 🐱‍🐉`))
    server.on('error', console.error);
    return app;
}




/*

33.49835344536643, 36.301467238746284
33.498384391798666, 36.30142338098637  // 5.61 



33.4983759518637, 36.30146498963039     //  8.83



33.4984250869997, 36.301164802487115
33.49850672639141, 36.30107964235953  // 12 metre


*/