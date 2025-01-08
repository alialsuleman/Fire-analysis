import { calculateCommonArea, distanceBetweenTwoPoint } from "../..";
import { db } from "../../../dataStore";
import { ADD_TIME_TO_DISASTER_END, FIRE_ACTIVATION_RATE, MIN_REQUIRE_COMMEN_AREA, MX_DISASTER_ID, SEVERITY_ARRAY_SIZE } from "../../../env";
import { CreateDisaster, Disaster, Position, Post, PureDisaster } from "../../../shared";
import { Disaster as GrpcDisaster } from "../../../proto/ndmsRpcEvent/Disaster";
import { disasterQueue } from "../../Queues";
import { Timestamp } from '../../../proto/google/protobuf/Timestamp';
import { DisasterDb } from "../../../dataStore/mongodb/db/disasterDb";
import { Slice } from "../slice";
import { Edge, EdgeModel } from "../../../dataStore/mongodb/schema/edge";




let idCounter = -1;
let sumTime = 0, startTime = 0, endTime = 0;


export function assiVAlue(n: number) {
    idCounter = n;
    //console.log("assiVAlue " + idCounter);
}











export class StaticSlice implements Slice {

    disaster: Array<Disaster> = [];
    latitudeIndex: number = 0;
    longitudeIndex: number = 0;

    id: number;


    constructor(Longitude: number, Latitude: number) {
        this.id = idCounter++;
        this.latitudeIndex = Latitude;
        this.longitudeIndex = Longitude;
    }
    public static async build(Longitude: number, Latitude: number): Promise<StaticSlice> {
        let slice: StaticSlice = new StaticSlice(Longitude, Latitude);
        await slice.getData();
        return slice;
    }


    async getData() {
        this.disaster = [];
        const savedDisaster = await db.disasterDB.getSliceByindex(this.longitudeIndex, this.latitudeIndex);

        for (let x of savedDisaster) {
            this.disaster.push(x);
        }
    }

    async getOrcreateDisaster(event: Post) {



        let newId: string = `${idCounter++}`;
        const mongodbPost = { ...event, disaster_id: newId };
        await db.postDB.addPost(mongodbPost);


        sumTime = 0;

        await this.getData();


        let sharedDisaster: Array<Disaster> = [];
        let index: number[] = [];
        let id: string[] = [];
        let cnt = 0;

        let mnDisasterTime = event.createdAt;
        let mxDisasterTime = event.createdAt + ADD_TIME_TO_DISASTER_END * event.severity;






        const puredisaster: PureDisaster = {
            isActive: false,
            position: event.position,
            radius: event.radius,
            startAt: mnDisasterTime,
            endAt: mxDisasterTime,
            severity: event.severity,
            confidence: event.confidence,
        };



        let y = 0;
        y += event.position.latitude;
        let x = 0;
        x += event.position.longitude;
        let radius = 0;
        radius += event.radius;


        // console.log("here");

        let last_len = sharedDisaster.length;
        let take: number[] = [];
        let num_of_post = 1;
        let new_severity_array: number[] = [];


        while (true) {



            let long = 0;
            long += event.position.longitude;
            let lat = 0;
            lat += event.position.latitude;
            let num = 1;


            for (let dis of this.disaster) {


                if (take[+dis._id] == 1) {

                    long += dis.numOfPost * dis.position.longitude;
                    lat += dis.numOfPost * dis.position.latitude;
                    num += dis.numOfPost;
                    continue;
                }

                let x11 = distanceBetweenTwoPoint({ x: +dis.position.longitude, y: +dis.position.latitude, radius: dis.radius },
                    { x, y, radius });


                if (x11 <= (radius + dis.radius)) {
                    sharedDisaster.push(dis);
                    index.push(cnt);
                    id.push(dis._id);
                    take[+dis._id] = 1;
                    long += dis.numOfPost * dis.position.longitude;
                    lat += dis.numOfPost * dis.position.latitude;
                    num += dis.numOfPost;
                }
                cnt++;
            }


            num_of_post = num;
            if (last_len == sharedDisaster.length) break;




            let x1 = long / num;
            let y1 = lat / num;
            let radius1 = 0;
            radius1 += event.radius;



            for (let dis of sharedDisaster) {
                let x11 = distanceBetweenTwoPoint({ x: +dis.position.longitude, y: +dis.position.latitude, radius: dis.radius },
                    { x: x1, y: y1, radius });
                radius1 = Math.max(radius1, x11 + dis.radius);
            }


            x = 0; y = 0; radius = 0; x += x1; y += y1; radius += radius1;


            if (last_len == sharedDisaster.length) break;
            last_len = sharedDisaster.length;
        }


        for (let i = 0; i <= SEVERITY_ARRAY_SIZE; i++) new_severity_array[i] = 0;
        for (let dis of sharedDisaster) {
            for (let i = 0; i <= SEVERITY_ARRAY_SIZE; i++) {
                new_severity_array[i] += dis.severity_array[i];
            }
        }
        new_severity_array[event.severity]++;



        let mx = 0, severity_value = 0;

        for (let i = 0; i <= SEVERITY_ARRAY_SIZE; i++) {
            if (mx <= new_severity_array[i]) {
                mx = new_severity_array[i];
                severity_value = i;
            }

        }




        console.log("here");


        //console.log("num " + sharedDisaster.length);
        let sumConfidence = event.confidence;
        sharedDisaster.map(x => sumConfidence += x.confidence * x.numOfPost);
        puredisaster.confidence = sumConfidence / num_of_post;
        puredisaster.isActive = (puredisaster.confidence >= FIRE_ACTIVATION_RATE);


        let num_likes = event.numLikes, num_disLikes = event.numDisLikes, num_comments = event.numComments;

        sharedDisaster.map(x => {
            num_likes += x.numLikes;
            num_disLikes += x.numDisLikes;
            num_comments += x.numComments;
        });


        console.log(num_likes);
        console.log(num_disLikes);
        console.log(num_comments);

        sharedDisaster.map(x => mnDisasterTime = Math.min(mnDisasterTime, x.startAt));
        sharedDisaster.map(x => mxDisasterTime = Math.max(mxDisasterTime, x.endAt));
        mxDisasterTime = Math.max(ADD_TIME_TO_DISASTER_END * event.severity + event.createdAt, mxDisasterTime);


        puredisaster.startAt = mnDisasterTime;
        puredisaster.endAt = mxDisasterTime;

        puredisaster.position.longitude = x;
        puredisaster.position.latitude = y;
        puredisaster.radius = radius;


        puredisaster.severity = severity_value;


        const mongodbDisaster: Disaster = {
            ...puredisaster,
            _id: newId,
            numOfPost: num_of_post,
            numOFlatitude: puredisaster.position.latitude * num_of_post,
            numOFlongitude: puredisaster.position.longitude * num_of_post,
            latitudeIndex: this.latitudeIndex,
            longitudeIndex: this.longitudeIndex,
            severity_array: new_severity_array,
            numLikes: num_likes,
            numDisLikes: num_disLikes,
            numComments: num_comments
        }





        /***********************************************************/
        /***********************************************************/
        //add new disaster to unit disaster array
        //add the new disaster to mongodb database
        /***********************************************************/
        // add the new post to mongodb database and set the refrence disaster id  as new disaster id 
        // todo 

        console.log(mongodbDisaster.numLikes);
        console.log(mongodbDisaster.numDisLikes);
        console.log(mongodbDisaster.numComments);

        this.disaster.push(mongodbDisaster);
        await db.disasterDB.updateOrCreate(mongodbDisaster);





        ///////////////////////////////////////////////////////////////

        const { startAt, endAt, ...newPure } = { ...puredisaster };


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
        /*
        
  
        */


        const deletePromises = [];
        const updatePromises = [];
        console.log("del ");
        grpcDisaster.type = 2;
        grpcDisaster.disastersIds = [];


        for (let dis of sharedDisaster) {
            grpcDisaster.disastersIds.push(dis._id);
            deletePromises.push(db.disasterDB.deleteDisaster(dis._id));
            updatePromises.push(db.postDB.updatePostsDisaster(dis._id, newId));
        }
        await Promise.all(updatePromises);
        await Promise.all(deletePromises);

        disasterQueue.add(grpcDisaster);





        this.disaster.push(mongodbDisaster);
        //await db.disasterDB.updateOrCreate(mongodbDisaster);
        return sumTime;
    }

    async addDisaster(disaster: Disaster) {
        this.disaster.push(disaster);
        await db.disasterDB.createDisaster(disaster);
    }

    async editDisaster(post: Post) {


        console.log(post);

        let databasePost = await db.postDB.getPost(post._id);
        console.log(databasePost);
        if (databasePost) {

            let old_disaster = await db.disasterDB.getById(databasePost?.disaster_id);
            console.log(old_disaster);
            if (old_disaster) {
                let mxDisasterTime = Math.max(post.createdAt + ADD_TIME_TO_DISASTER_END * post.severity, old_disaster.endAt);
                old_disaster.endAt = mxDisasterTime;

                let sumConfidence = old_disaster.confidence * old_disaster.numOfPost;

                sumConfidence -= databasePost.confidence;
                sumConfidence += post.confidence;

                console.log(post);
                old_disaster.confidence = sumConfidence / old_disaster.numOfPost;
                old_disaster.isActive = (old_disaster.confidence >= FIRE_ACTIVATION_RATE);
                databasePost.confidence = post.confidence;
                await db.disasterDB.updateOrCreate(old_disaster);


                const { startAt, endAt, ...newPure } = { ...old_disaster };


                const grpcDisaster: GrpcDisaster = {
                    type: 2,
                    id: old_disaster._id,
                    disastersIds: [],
                    postIds: [],
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

                await db.postDB.updatePost(databasePost);
                await this.getData();

            }

        }
    }

    removeDisaster(): Promise<any> {
        throw new Error("Method not implemented.");
        //return { x: 0 };
    }



}






//  //  console.log(1);
//             let xxx: number[] = [];
//             xxx[1] = xxx[2] = xxx[3] = xxx[4] = 0;

//             let newId: string = "ASDASD";
//             let numberOfPost = 1;
//             let sumSeverity = event.severity;
//             let sumLongitude = 1.00000 * event.position.longitude;
//             let sumLatitude = 1.00000 * event.position.latitude;
//             ///    console.log(event.position.longitude + " " + event.position.latitude);
//             let mxRelation = 0;

//             let mnDisasterTime = event.createdAt;
//             let mxDisasterTime = event.createdAt;




//             sharedDisaster.map(x => mnDisasterTime = Math.min(mnDisasterTime, x.startAt));
//             sharedDisaster.map(x => mxDisasterTime = Math.max(mxDisasterTime, x.endAt));
//             mxDisasterTime = Math.max(ADD_TIME_TO_DISASTER_END * event.severity + event.createdAt, mxDisasterTime);


//             //  console.log('match found !');
//             /***********************************************************/
// //  1- create new disaster by merge all this disaster then mege the resault with post info
// // it need to handle time and anthor stuff

// sharedDisaster.map(x => { if (x.numOfPost >= mxRelation) { newId = x._id; mxRelation = x.numOfPost; } });



// const mongodbPost = { ...event, disaster_id: newId };
// await db.postDB.addPost(mongodbPost);

// sharedDisaster.map(x => {
//     //   console.log(sumLongitude + " 123 " + x.position.longitude)
//     sumLongitude += 1.00000 * x.position.longitude;
//     //console.log("123 " + x.position.longitude)
// });
// sharedDisaster.map(x => {
//     //  console.log(sumLatitude + " 124 " + x.position.latitude)
//     sumLatitude += 1.00000 * x.position.latitude

// });

// sharedDisaster.map(x => numberOfPost += x.numOfPost)




// if (event.confidence == 1) xxx[1] = 1;
// else if (event.confidence == 2) xxx[2] += 1;
// else if (event.confidence == 3) xxx[3] += 1;
// else if (event.confidence == 4) xxx[4] += 1;
// sharedDisaster.map(x => xxx[1] += x.confidence_array.fisrt)
// sharedDisaster.map(x => xxx[2] += x.confidence_array.second)
// sharedDisaster.map(x => xxx[3] += x.confidence_array.third)
// sharedDisaster.map(x => xxx[4] += x.confidence_array.fourth)


// sharedDisaster.map(x => sumSeverity += x.severity * x.numOfPost)




// /***********************************************************/
// //  calculate new  ( x, y )

// //console.log(sumLatitude + " x y  " + sumLongitude);
// y = sumLatitude / (sharedDisaster.length + 1);
// x = sumLongitude / (sharedDisaster.length + 1);
// //console.log(x + " x y  " + y);
// //console.log((sharedDisaster.length + 1));
// radius = 0;

// let distance = distanceBetweenTwoPoint(
//     { x, y, radius },
//     { x: +event.position.longitude, y: +event.position.latitude, radius: event.radius }
// );
// distance = distance + event.radius;
// radius = Math.max(distance, radius)
// //  console.log("R " + radius)

// for (let dis of sharedDisaster) {
//     //

//     const yy = await db.postDB.getPostDisaster(dis._id);
//     let distance2 = distanceBetweenTwoPoint(
//         { x, y, radius },
//         { x: +dis.position.longitude, y: +dis.position.latitude, radius: dis.radius }
//     );
//     radius = Math.max(distance2 + Math.max(dis.radius, event.radius), radius);
//     ///    console.log("R +  p " + radius);

//     //     for (let xx of yy) {


//     //         let distance2 = distanceBetweenTwoPoint(
//     //             { x, y, radius },
//     //             { x: +xx.position.longitude, y: +xx.position.latitude, radius: xx.radius }
//     //         );
//     //         radius = Math.max(distance2 + xx.radius, radius);
//     //         ///    console.log("R +  p " + radius);
//     //         if (dis._id === newId) continue;
//     //         const edge: Edge = {
//     //             latitude1: event.position.latitude,
//     //             longitude1: event.position.longitude,
//     //             latitude2: xx.position.latitude,
//     //             longitude2: xx.position.longitude,
//     //         }
//     //         const ed = new EdgeModel(edge);
//     //         await ed.save();
//     //         //  console.log("edge " + edge);
//     //     }
// }

// event.position.latitude = y;
// event.position.longitude = x;
// event.radius = radius;



// /***********************************************************/

// let mxConfidence = Math.max(...xxx);
// if (xxx[1] == mxConfidence) event.confidence = 1;
// else if (xxx[2] == mxConfidence) event.confidence = 2;
// else if (xxx[3] == mxConfidence) event.confidence = 3;
// else if (xxx[4] == mxConfidence) event.confidence = 4;

// /****** */
// const pureDisaster: PureDisaster = {
//     isActive: false,
//     position: event.position,
//     radius: event.radius,
//     startAt: mnDisasterTime,
//     endAt: mxDisasterTime,
//     severity: sumSeverity / numberOfPost,
//     confidence: event.confidence,
// }




// /***********************************************************/
// //   Active or disActive the disaster
// //  console.log(pureDisaster.severity + " " + FIRE_ACTIVATION_RATE)
// pureDisaster.isActive = (pureDisaster.severity >= FIRE_ACTIVATION_RATE);

// /***********************************************************/
// //  -! mongodbDisaster
// const mongodbDisaster: Disaster = {
//     ...pureDisaster,
//     _id: newId,
//     numOfPost: numberOfPost,
//     numOFlatitude: sumLatitude,
//     numOFlongitude: sumLongitude,
//     latitudeIndex: this.latitudeIndex,
//     longitudeIndex: this.longitudeIndex,
//     confidence_array: {
//         fisrt: xxx[1],
//         second: xxx[2],
//         third: xxx[3],
//         fourth: xxx[4]
//     }
// };


// //            console.log(mongodbDisaster);


// /***********************************************************/
// // GRPC


// const { startAt, endAt, ...newPure } = { ...pureDisaster };


// const grpcDisaster: GrpcDisaster = {
//     type: 2,
//     id: newId,
//     disastersIds: [],
//     postIds: [event._id],
//     ...newPure,
//     startAt: {
//         seconds: startAt / 1000,
//         nanos: startAt % 1000
//     },
//     endAt: {
//         seconds: endAt / 1000,
//         nanos: endAt % 1000
//     }
// }






// // delete old disaster and update old post with new diasaster
// const deletePromises = [];
// const updatePromises = [];
// for (let dis of sharedDisaster) {
//     if (dis._id === newId) continue;

//     grpcDisaster.disastersIds.push(dis._id);
//     deletePromises.push(db.disasterDB.deleteDisaster(dis._id));
//     updatePromises.push(db.postDB.updatePostsDisaster(dis._id, newId));
// }
// await Promise.all(deletePromises);
// await Promise.all(updatePromises);

// disasterQueue.add(grpcDisaster);




// /***********************************************************/
// //delete the disasters that i merge it from unit disaster array
// // Remove elements from the disaster array based on indices stored in the index array
// index.sort((a, b) => b - a);
// index.forEach(idx => {
//     if (idx >= 0 && idx < this.disaster.length) {
//         this.disaster.splice(idx, 1);
//     }
// });

// /***********************************************************/
// // add new disaster and new post to disaster mongodb schema this object
// this.disaster.push(mongodbDisaster);
// await db.disasterDB.updateOrCreate(mongodbDisaster);



// let yxaVECTOR = (p1.latitude - (p1.latitude + p2.latitude) / 2);
// let xxaVECTOR = (p1.longitude - (p1.longitude + p2.longitude) / 2);

// let dissss = Math.sqrt(xxaVECTOR * xxaVECTOR + yxaVECTOR * yxaVECTOR);
// xxaVECTOR *= r1;
// yxaVECTOR *= r1;
// xxaVECTOR /= dissss;
// yxaVECTOR /= dissss;

// p1.longitude += xxaVECTOR;
// p1.latitude += yxaVECTOR;
// xxaVECTOR *= r2;
// xxaVECTOR /= -r1;
// yxaVECTOR *= r2;
// yxaVECTOR /= -r1;

// p2.longitude += xxaVECTOR;
// p2.latitude += yxaVECTOR;


// let p1: Position = event.position,
// p2: Position = event.position,
// r1: number = 0,
// r2: number = 0,
// mx = 0;

// for (let disi of sharedDisaster) {

// let distance = distanceBetweenTwoPoint(
//     { x: +disi.position.longitude, y: +disi.position.latitude, radius: disi.radius },
//     { x: +event.position.longitude, y: +event.position.latitude, radius: event.radius }
// );


// if (distance > mx) {
//     mx = distance;
//     p1 = disi.position;
//     p2 = event.position;
//     r1 = disi.radius;
//     r2 = event.radius;
// }
// }

// for (let disi of sharedDisaster) {
// for (let disj of this.disaster) {
//     if (disi._id == disj._id) continue;

//     let distance = distanceBetweenTwoPoint(
//         { x: +disi.position.longitude, y: +disi.position.latitude, radius: disi.radius },
//         { x: +disj.position.longitude, y: +disj.position.latitude, radius: disj.radius }
//     );
//     if (distance > mx) {
//         mx = distance;
//         p1 = disi.position;
//         p2 = disj.position;
//         r1 = disi.radius;
//         r2 = disj.radius;
//     }
// }
// }






// let y1 = (p1.latitude + p2.latitude) / 2;
// let x1 = (p1.longitude + p2.longitude) / 2;
// let maxDis = radius;
// for (let disi of sharedDisaster) {
// let distance = distanceBetweenTwoPoint(
//     { x: +disi.position.longitude, y: +disi.position.latitude, radius: disi.radius },
//     { x: +x1, y: +y1, radius: 0 }
// );
// maxDis = Math.max(distance + disi.radius, maxDis);

// }

// x = x1;
// y = y1;
// radius = maxDis;

