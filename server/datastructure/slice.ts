import { calculateCommonArea, distanceBetweenTwoPoint, queue } from ".";
import { db } from "../dataStore";
import { ADD_TIME_TO_DISASTER_END, FIRE_ACTIVATION_RATE, MIN_REQUIRE_COMMEN_AREA } from "../env";
import { CreateDisaster, Disaster, Post, PureDisaster } from "../shared";
import { Disaster as GrpcDisaster } from "../proto/ndmsRpcEvent/Disaster";
import { disasterQueue } from "../Queues";
import { Timestamp } from '../proto/google/protobuf/Timestamp';



let idCounter = 10000000000;
let sumTime = 0, startTime = 0, endTime = 0;




export class Slice {

    disaster: Array<Disaster> = [];
    latitudeIndex: number = 0;
    longitudeIndex: number = 0;

    id: number;


    constructor(Latitude: number, Longitude: number) {
        this.id = idCounter++;
        this.latitudeIndex = Latitude;
        this.longitudeIndex = Longitude;

    }

    async getData() {

        const savedDisaster = await db.getSliceByindex(this.latitudeIndex, this.longitudeIndex);
        //  console.log("saved disaster");
        // console.log(savedDisaster);

        for (let x of savedDisaster) {
            //   console.log(x);
            this.disaster.push(x);
        }
    }

    async getOrcreateDisaster(event: Post) {
        sumTime = 0;
        // console.log(event._id + ' ' + event.position.latitude + ' ' + event.position.longitude + ' ' + event.radius);


        ///  repqir the calculate of the start and end and isactive and   severity , confidence
        let sharedDisaster: Array<Disaster> = [];
        let index: number[] = [];
        let id: string[] = [];
        let cnt = 0;
        let x = event.position.latitude;
        let y = event.position.longitude;
        let radius = event.radius;



        for (let dis of this.disaster) {
            let commonArea = calculateCommonArea(
                { x: +dis.position.latitude, y: +dis.position.longitude, radius: dis.radius },
                { x, y, radius }
            );

            if (commonArea >= MIN_REQUIRE_COMMEN_AREA) {
                sharedDisaster.push(dis);
                index.push(cnt);
                id.push(dis._id);
            }

            cnt++;
        }




        if (sharedDisaster.length) {


            let xxx: number[] = [];
            xxx[1] = xxx[2] = xxx[3] = xxx[4] = 0;

            let newId: string = "ASDASD";
            let numberOfPost = 1;
            let sumSeverity = event.severity;
            let sumLongitude = event.position.longitude;
            let sumLatitude = event.position.latitude;
            let mxRelation = 0;

            let mnDisasterTime = event.createdAt;
            let mxDisasterTime = event.createdAt;




            sharedDisaster.map(x => mnDisasterTime = Math.min(mnDisasterTime, x.startAt));
            sharedDisaster.map(x => mxDisasterTime = Math.max(mxDisasterTime, x.endAt));
            mxDisasterTime = Math.max(ADD_TIME_TO_DISASTER_END * event.severity + event.createdAt, mxDisasterTime);


            //  console.log('match found !');
            /***********************************************************/
            //  1- create new disaster by merge all this disaster then mege the resault with post info  
            // it need to handle time and anthor stuff 

            sharedDisaster.map(x => { if (x.numOfPost >= mxRelation) { newId = x._id; mxRelation = x.numOfPost; } });
            const mongodbPost = { ...event, disaster_id: newId };



            sharedDisaster.map(x => sumLongitude += x.numOFlongitude);
            sharedDisaster.map(x => sumLatitude += x.numOFlatitude);

            sharedDisaster.map(x => numberOfPost += x.numOfPost)




            if (event.confidence == 1) xxx[1] = 1;
            else if (event.confidence == 2) xxx[2] += 1;
            else if (event.confidence == 3) xxx[3] += 1;
            else if (event.confidence == 4) xxx[4] += 1;
            sharedDisaster.map(x => xxx[1] += x.confidence_array.fisrt)
            sharedDisaster.map(x => xxx[2] += x.confidence_array.second)
            sharedDisaster.map(x => xxx[3] += x.confidence_array.third)
            sharedDisaster.map(x => xxx[4] += x.confidence_array.fourth)


            sharedDisaster.map(x => sumSeverity += x.severity * x.numOfPost)




            /***********************************************************/
            //  calculate new  ( x, y )

            x = sumLatitude / numberOfPost;
            y = sumLongitude / numberOfPost;
            radius = 0;

            let distance = distanceBetweenTwoPoint(
                { x, y, radius },
                { x: +event.position.latitude, y: +event.position.longitude, radius: event.radius }
            );
            distance = distance + event.radius;
            radius = Math.max(distance, radius)

            for (let dis of sharedDisaster) {
                distance = distanceBetweenTwoPoint(
                    { x, y, radius },
                    { x: +dis.position.latitude, y: +dis.position.longitude, radius: dis.radius }
                );
                distance = distance + dis.radius;
                radius = Math.max(distance, radius);
            }
            event.position.latitude = x;
            event.position.longitude = y;
            event.radius = radius;

            /***********************************************************/

            let mxConfidence = Math.max(...xxx);
            if (xxx[1] == mxConfidence) event.confidence = 1;
            else if (xxx[2] == mxConfidence) event.confidence = 2;
            else if (xxx[3] == mxConfidence) event.confidence = 3;
            else if (xxx[4] == mxConfidence) event.confidence = 4;

            /****** */
            const pureDisaster: PureDisaster = {
                isActive: false,
                position: event.position,
                radius: event.radius,
                startAt: mnDisasterTime,
                endAt: mxDisasterTime,
                severity: sumSeverity / numberOfPost,
                confidence: event.confidence,
            }



            /***********************************************************/
            //   Active or disActive the disaster 
            pureDisaster.isActive = (pureDisaster.severity >= FIRE_ACTIVATION_RATE);

            /***********************************************************/
            //  -! mongodbDisaster
            const mongodbDisaster: Disaster = {
                ...pureDisaster,
                _id: newId,
                numOfPost: numberOfPost,
                numOFlatitude: sumLatitude,
                numOFlongitude: sumLongitude,
                latitudeIndex: this.latitudeIndex,
                longitudeIndex: this.longitudeIndex,
                confidence_array: {
                    fisrt: xxx[1],
                    second: xxx[2],
                    third: xxx[3],
                    fourth: xxx[4]
                }
            };





            /***********************************************************/
            // GRPC


            const { startAt, endAt, ...newPure } = { ...pureDisaster };


            const grpcDisaster: GrpcDisaster = {
                type: 1,
                id: newId,
                disastersIds: [],
                postIds: [event._id],
                ...newPure,
                startAt: {
                    seconds: startAt / 1000,
                    nanos: startAt % 1000
                },
                endAt: {
                    seconds: endAt / 1000,
                    nanos: endAt % 1000
                }
            }






            // delete old disaster and update old post with new diasaster
            const deletePromises = [];
            const updatePromises = [];
            for (let dis of sharedDisaster) {
                if (dis._id === newId) continue;
                grpcDisaster.disastersIds.push(dis._id);
                deletePromises.push(db.deleteDisaster(dis._id));
                updatePromises.push(db.updatePostsDisaster(dis._id, newId));
            }
            await Promise.all(deletePromises);
            await Promise.all(updatePromises);

            disasterQueue.add(grpcDisaster);




            /***********************************************************/
            //delete the disasters that i merge it from unit disaster array
            // Remove elements from the disaster array based on indices stored in the index array
            index.sort((a, b) => b - a);
            index.forEach(idx => {
                if (idx >= 0 && idx < this.disaster.length) {
                    this.disaster.splice(idx, 1);
                }
            });

            /***********************************************************/
            // add new disaster and new post to disaster mongodb schema this object 
            this.disaster.push(mongodbDisaster);
            await db.updateOrCreate(mongodbDisaster);
            await db.addPost(mongodbPost);

        }
        else {

            /***********************************************************/
            //create new disaster node 

            let mnDisasterTime = event.createdAt;
            let mxDisasterTime = event.createdAt + ADD_TIME_TO_DISASTER_END * event.severity;


            const puredisaster: PureDisaster = {
                isActive: false,
                position: event.position,
                radius: radius,
                startAt: mnDisasterTime,
                endAt: mxDisasterTime,
                severity: event.severity,
                confidence: event.confidence,
            };

            let newId: string = `${idCounter++}`;

            const mongodbDisaster: Disaster = {
                ...puredisaster,
                _id: newId,
                numOfPost: 1,
                numOFlatitude: event.position.latitude,
                numOFlongitude: event.position.longitude,
                latitudeIndex: this.latitudeIndex,
                longitudeIndex: this.longitudeIndex,
                confidence_array: {
                    fisrt: 0,
                    second: 0,
                    third: 0,
                    fourth: 0
                }
            }


            if (event.confidence == 1) mongodbDisaster.confidence_array.fisrt = 1;
            else if (event.confidence == 2) mongodbDisaster.confidence_array.second = 1;
            else if (event.confidence == 3) mongodbDisaster.confidence_array.third = 1;
            else if (event.confidence == 4) mongodbDisaster.confidence_array.fourth = 1;

            puredisaster.confidence = mongodbDisaster.confidence;



            /***********************************************************/
            /***********************************************************/
            //add new disaster to unit disaster array
            //add the new disaster to mongodb database
            /***********************************************************/
            // add the new post to mongodb database and set the refrence disaster id  as new disaster id 
            // todo 



            this.disaster.push(mongodbDisaster);
            await db.updateOrCreate(mongodbDisaster);

            const mongodbPost = { ...event, disaster_id: newId };
            await db.addPost(mongodbPost);



            ///////////////////////////////////////////////////////////////

            const { startAt, endAt, ...newPure } = { ...puredisaster };


            const grpcDisaster: GrpcDisaster = {
                type: 0,
                id: newId,
                disastersIds: [],
                postIds: [event._id],
                ...newPure,
                startAt: {
                    seconds: startAt / 1000,
                    nanos: startAt % 1000
                },
                endAt: {
                    seconds: endAt / 1000,
                    nanos: endAt % 1000
                }
            }
            disasterQueue.add(grpcDisaster);
            //  console.log(JSON.stringify(mongodbDisaster));
            // console.log(JSON.stringify(grpcDisaster));

        }
        return sumTime;
    }

    async addDisaster(disaster: Disaster) {
        this.disaster.push(disaster);
        await db.createDisaster(disaster);
    }

    async editDisaster(post: Post) {
        let databasePost = await db.getPost(post._id);

        for (let i = 0; i < this.disaster.length; i++) {

            if (this.disaster[i]._id == databasePost?.disaster_id) {

                let mxDisasterTime = Math.max(post.createdAt + ADD_TIME_TO_DISASTER_END * post.severity, this.disaster[i].endAt);

                this.disaster[i].endAt = mxDisasterTime;

                let sumSeverity = this.disaster[i].severity * this.disaster[i].numOfPost;


                sumSeverity -= databasePost.severity;
                sumSeverity += post.severity;

                this.disaster[i].severity = sumSeverity / this.disaster[i].numOfPost;
                databasePost.severity = post.severity;


                await db.updatePost(databasePost);
                await db.updateOrCreate(this.disaster[i]);
                break;
            }
        }
    }




    removeDisaster() {

    }



}


