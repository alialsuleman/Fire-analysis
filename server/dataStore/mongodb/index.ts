import path from 'path'

import { DataStore } from "..";

import { Disaster } from '../../shared';
import { DisasterModel, PostModel } from './schema';
import mongoose, { Connection } from 'mongoose';
import { MONGO_URL, MONGO_PAS, MONGO_USR } from './config'
import { MongodbPost, Post } from '../../shared/post';




export class SqlDataStore implements DataStore {


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
        return this;
    }


    async createDisaster(disaster: Disaster): Promise<void> {
        //   console.log(disaster);
        const dis = new DisasterModel(disaster);
        await dis.save();
    }
    async deleteOldDisasterCreateNew(disaster: Disaster): Promise<void> {
        //   console.log(disaster);
        await this.deleteDisaster(disaster._id);
        const dis = new DisasterModel(disaster);
        await dis.save();
    }

    async updateDisaster(disaster: Disaster): Promise<void> {
        await DisasterModel.updateOne({ _id: disaster._id }, disaster);
    }



    async updateOrCreate(disaster: Disaster): Promise<void> {
        const filter = { _id: disaster._id };
        const update = {
            $set: {
                isActive: disaster.isActive,
                position: disaster.position,
                radius: disaster.radius,
                startAt: disaster.startAt,
                endAt: disaster.endAt,
                severity: disaster.severity,
                confidence: disaster.confidence,
                numOfPost: disaster.numOfPost,
                numOFlatitude: disaster.numOFlatitude,
                numOFlongitude: disaster.numOFlongitude,
                confidence_array: disaster.confidence_array
            }
        };
        const options = { upsert: true };

        await DisasterModel.findOneAndUpdate(filter, update, options);
    }





    async getWithRange(x1: number, y1: number, x2: number, y2: number): Promise<Disaster[]> {

        return await DisasterModel.find({
            'position.latitude': { "$gte": x1, "$lte": x2 },
            'position.longitude': { "$gte": y1, "$lte": y2 }
        });

    }

    async getSliceByindex(x: number, y: number): Promise<Disaster[]> {
        //  console.log(x + ' ' + y);
        return await DisasterModel.find({ latitudeIndex: x, longitudeIndex: y });
    }


    async deleteDisaster(id: string): Promise<void> {
        await DisasterModel.deleteOne({ _id: id });
    }
    async getAllDisaster(): Promise<Disaster[]> {
        return await DisasterModel.find();
    }




    async addPost(post: MongodbPost): Promise<void> {
        const newPost = new PostModel(post);
        await newPost.save();
    }

    async updatePostsDisaster(lastDisasterId: string, newDisasterId: string): Promise<void> {
        // Define the update operation
        const updateOperation = {
            $set: { Disaster_id: newDisasterId }
        };
        // Define the query to match posts with Disaster_id equal to 'x'
        const query = { Disaster_id: lastDisasterId };
        // Perform the update operation
        PostModel.updateMany(query, updateOperation);
    }


}

