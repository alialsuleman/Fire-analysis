import express, { NextFunction, Request, Response, response } from 'express';

import { Position } from './shared';
import { AppError } from './utils/appError';
import { ERROR } from './utils/httpstatusText';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { ANALYSER_DELAY, latitudeShift, longitudeShift, PORT } from './env';
import { Post } from './shared/post';
import { db } from './dataStore';
import { getSlicingIndex } from './analyser';
import { Edge, EdgeModel, EdgeSchema, getAll } from './dataStore/mongodb/schema/edge';



export function startServer() {


    const app = express();


    app.use(cors())
    app.use(cookieParser());
    app.use(express.json());

    app.get('/alldisaster', async (req, res) => {
        //   console.log("get Disasters ");
        let disaster = await db.disasterDB.getAllDisaster();
        res.send(disaster)
        //res.send( 'from express server '+ JSON.stringify(worldSliceing[0][110])) ;
    })

    app.get('/allpost', async (req, res) => {
        let posts = await db.postDB.getAll();
        //   console.log("posts");
        res.send(posts)
        //res.send( 'from express server '+ JSON.stringify(worldSliceing[0][110])) ;
    })
    app.get('/AllEdge', async (req, res) => {

        let edge = await getAll();



        res.send(edge)
        //res.send( 'from express server '+ JSON.stringify(worldSliceing[0][110])) ;
    })

    app.get('/getDataForNode/:node', async (req: Request<{ node: string }, {}, {}, {}>, res) => {


        let data = await db.postDB.getPostDisaster(req.params.node);
        res.send(data);
        //res.send( 'from express server '+ JSON.stringify(worldSliceing[0][110])) ;
    })

    app.get('/index', async (req, res) => {


        res.send(db.disasterDB.map__segIndex_to_sliceIndex);
        //res.send( 'from express server '+ JSON.stringify(worldSliceing[0][110])) ;
    })



    app.post('/getdisasterinrange', async (req: Request<{}, {}, { longitude0: number, latitude0: number, longitude1: number, latitude1: number, numOfSkip: number }, {}>, res: Response) => {

        let x0 = req.body.longitude0;
        let x1 = req.body.longitude1;
        let y0 = req.body.latitude0;
        let y1 = req.body.latitude1;
        let numOfSkip = req.body.numOfSkip;
        let ind1 = getSlicingIndex(x0, y0);
        let ind2 = getSlicingIndex(x1, y1);
        console.log(ind1);
        console.log(ind2);
        let level = 1;
        if (x1 - x0 > 100) level = 2;
        if (x1 - x0 > 1000) level = 3;
        if (x1 - x0 > 10000) level = 4;
        console.log("level: " + level);
        const disasters = await db.disasterDB.getAllDisasterInRange(ind1.x, ind1.y, ind2.x, ind2.y, level, numOfSkip)


        res.send({
            disasters
        });  // need fix 
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