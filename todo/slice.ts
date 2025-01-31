import { calculateCommonArea, distanceBetweenTwoPoint, queue } from ".";
import { db } from "../dataStore";
import { FIRE_ACTIVATION_RATE, MIN_REQUIRE_COMMEN_AREA } from "../env";
import { CreateDisaster, Disaster, Post, PureDisaster } from "../shared";




let idCounter = 12000000000;
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

            //  console.log('match found !');
            /***********************************************************/
            //  1- create new disaster by merge all this disaster then mege the resault with post info  
            // it need to handle time and anthor stuff 

            let xxx: number[] = [];
            xxx[1] = xxx[2] = xxx[3] = xxx[4] = 0;

            if (event.confidence == 1) xxx[1] = 1;
            else if (event.confidence == 2) xxx[2] += 1;
            else if (event.confidence == 3) xxx[3] += 1;
            else if (event.confidence == 4) xxx[4] += 1;



            let numberOfPost = 1;
            let sumSeverity = event.severity;
            let sumLongitude = event.position.longitude, sumLatitude = event.position.latitude;

            let newId: string = "ASDASD";
            let mxRelation = 0;
            // console.log('shared disaster :  ');
            for (let dis of sharedDisaster) {
                //console.log(dis._id);
                // small to large  
                if (dis.numOfPost >= mxRelation) {
                    newId = dis._id;
                    mxRelation = dis.numOfPost;
                }

                sumLongitude += dis.numOFlongitude;
                sumLatitude += dis.numOFlatitude;
                numberOfPost += dis.numOfPost;


            }
            // console.log('new ID : ' + newId);
            //console.log(numberOfPost);


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

            /***********************************************************/


            for (let dis of sharedDisaster) {
                //  build confidence array 
                xxx[1] += dis.confidence_array.fisrt;
                xxx[2] += dis.confidence_array.second;
                xxx[3] += dis.confidence_array.third;
                xxx[4] += dis.confidence_array.fourth;

                // give the sum of all severity
                sumSeverity += dis.severity * dis.numOfPost;
            }



            event.position.latitude = x;
            event.position.longitude = y;

            const pureDisaster: PureDisaster = {
                isActive: true,
                position: event.position,
                radius: radius,
                startAt: event.createdAt,
                endAt: event.createdAt,
                severity: sumSeverity / numberOfPost,
                confidence: event.confidence,
            }



            /***********************************************************/
            //   Active or disActive the disaster 
            pureDisaster.isActive = (pureDisaster.severity >= FIRE_ACTIVATION_RATE);


            /***********************************************************/
            //  -!
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
            //   calculate the confidence



            let mx = Math.max(mongodbDisaster.confidence_array.fisrt,
                mongodbDisaster.confidence_array.second,
                mongodbDisaster.confidence_array.third,
                mongodbDisaster.confidence_array.fourth);

            if (mongodbDisaster.confidence_array.fisrt == mx) mongodbDisaster.confidence = 1;
            else if (mongodbDisaster.confidence_array.second == mx) mongodbDisaster.confidence = 2;
            else if (mongodbDisaster.confidence_array.third == mx) mongodbDisaster.confidence = 3;
            else if (mongodbDisaster.confidence_array.fourth == mx) mongodbDisaster.confidence = 4;

            /***********************************************************/
            //   edit the confidence in PureDisaster
            pureDisaster.confidence = mongodbDisaster.confidence;

            /***********************************************************/
            // send  this new disaster, and all the disasters id's that i merge it to delete it from database and create new disaster and get the new disasterID   
            // it need to handle  get by api
            // mergeDisaster

            // const mergeDisaster: MergeDisaster = {
            //     ...pureDisaster, Disasters_id: id, postIds: [event._id]
            // }






            /***********************************************************/
            // delete the disasters that i merge it from mongodb database 
            //edit the disaster_id from posts schema -that related to all last disastater that i remove  - to new disaster id 



            // delete old disaster and update old post with new diasaster
            const deletePromises = [];
            const updatePromises = [];

            for (let dis of sharedDisaster) {
                if (dis._id === newId) continue;
                deletePromises.push(db.deleteDisaster(dis._id));
                updatePromises.push(db.updatePostsDisaster(dis._id, newId));
            }

            // Execute delete and update operations concurrently
            startTime = Date.now();
            await Promise.all(deletePromises);
            await Promise.all(updatePromises);
            endTime = Date.now();

            sumTime += endTime - startTime;





            /***********************************************************/
            //delete the disasters that i merge it from unit disaster array
            // Remove elements from the disaster array based on indices stored in the index array
            index.sort((a, b) => b - a);

            index.forEach(idx => {
                if (idx >= 0 && idx < this.disaster.length) {
                    this.disaster.splice(idx, 1);
                }
            });

            this.disaster.push(mongodbDisaster);

            /***********************************************************/
            // add new disaster to disaster mongodb schema
            startTime = Date.now();
            await db.updateOrCreate(mongodbDisaster);
            endTime = Date.now();
            sumTime += endTime - startTime;
            /***********************************************************/
            // add the new post to mongodb database and set the refrence disaster id  as new disaster id 
            startTime = Date.now();
            const mongodbPost = { ...event, disaster_id: newId };
            db.addPost(mongodbPost);
            endTime = Date.now();
            sumTime += endTime - startTime;
        }
        else {

            /***********************************************************/
            //create new disaster node 
            const puredisaster: PureDisaster = {
                isActive: false,
                position: event.position,
                radius: radius,
                startAt: event.createdAt,
                endAt: event.createdAt,
                severity: event.severity,
                confidence: event.confidence,
            };



            const mongodbDisaster: Disaster = {
                ...puredisaster,
                _id: "null",
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



            const createDisaster: CreateDisaster = {
                ...puredisaster,
                postIds: [event._id]
            }

            /***********************************************************/
            //send  this new disaster to the backend server to add it to graph database by it's apiand get the new disasterID   
            // createdisaster + send with postIds : [event._id] ; and remove confidence_array            
            /// /analyzer/disaster/create



            let newId: string = `${idCounter++}`;
            mongodbDisaster._id = newId;



            /***********************************************************/
            //add new disaster to unit disaster array
            //add the new disaster to mongodb database
            startTime = Date.now();

            await this.addDisaster(mongodbDisaster);
            endTime = Date.now();
            sumTime += endTime - startTime;



            /***********************************************************/
            // add the new post to mongodb database and set the refrence disaster id  as new disaster id 
            // todo 
            const mongodbPost = { ...event, disaster_id: newId };
            startTime = Date.now();
            await db.addPost(mongodbPost);
            endTime = Date.now();
            sumTime += endTime - startTime;
        }
        return sumTime;
    }

    async addDisaster(disaster: Disaster) {
        this.disaster.push(disaster);
        await db.createDisaster(disaster);
    }

    removeDisaster() {

    }

}


