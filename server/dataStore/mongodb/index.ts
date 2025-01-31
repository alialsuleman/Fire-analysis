import path from 'path'



import mongoose, { Connection } from 'mongoose';
import { MONGO_URL, MONGO_PAS, MONGO_USR } from './config'
import { DataStore } from '../dataStore';
import { DisasterCache } from '../cashing/DisasterCache';
import { DisasterDao, PostDao } from '../dao';
import { postDb } from './db/postDb';


let disaster = () => {

}





export class NoSqlDataStore implements DataStore {


    disasterDB: DisasterDao = new DisasterCache();
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

