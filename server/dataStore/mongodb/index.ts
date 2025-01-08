import path from 'path'



import { Disaster } from '../../shared';
import { DisasterModel, PostModel } from './schema';
import mongoose, { Connection } from 'mongoose';
import { MONGO_URL, MONGO_PAS, MONGO_USR } from './config'
import { MongodbPost, Post } from '../../shared/post';
import { DisasterDao, PostDao } from '../dao';
import { DataStore } from '../dataStore';
import { DisasterDb } from './db/disasterDb';
import { postDb } from './db/postDb';
import { DisasterCache } from '../cashing/DisasterCache';


let disaster = () => {

}





export class NoSqlDataStore implements DataStore {


    disasterDB: DisasterCache = new DisasterCache();
    postDB: PostDao = new postDb();


    async openDb() {
        mongoose.Promise = global.Promise;
        // @ts-ignore
        mongoose.connect(MONGO_URL, {
            user: MONGO_USR,
            pass: MONGO_PAS,
            minPoolSize: 10
        }).then(() => {
            console.log('successfully connected to the database');
        }).catch(err => {
            console.log(err);
            process.exit();
        });
        this.disasterDB = new DisasterCache();
        this.postDB = new postDb();
        return this;
    }





}

