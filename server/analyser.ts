import { db, initDb } from "./dataStore";

import { ANALYSER_DELAY, DEGREE_IN_KM, latitudeShift, longitudeShift, MX_DISASTER_ID } from "./env";
import { Post } from "./shared";
import { disasterQueue, sharedPostsQueue } from "./datastructure/Queues";
import { DisasterMetaDataDoc, PostModel } from "./dataStore/mongodb/schema";
import { DisasterController } from "./controllers/disasterController";
import { DisasterInfoDoc, DisasterInfoModel, DisasterMetaDataModel } from "./dataStore/mongodb/schema/Disaster";





// slice with size 1 km ^2
export function getSlicingIndex(latitude: number, longitude: number) {
    let latitudeIndex = Math.floor((latitude + latitudeShift) * DEGREE_IN_KM / 100);
    let longitudeIndex = Math.floor((longitude + longitudeShift) * DEGREE_IN_KM / 100);
    return {
        longitude: longitudeIndex,
        latitude: latitudeIndex
    }
}









let startTime = Date.now();
let endTime = Date.now();
let sumTime: number = 0;

let DELAY = 5000;


let disasterController: DisasterController = new DisasterController(db);


async function start() {

    ///// some db 

    let databaseTime = 0;

    if (sharedPostsQueue.getSize()) {
        DELAY = 1000;
        let GRPC_post = sharedPostsQueue.front();
        if (GRPC_post) {


            const post = new PostModel({
                ...GRPC_post,
                createdAt: new Date()
            });
            await post.save();
            console.log(JSON.stringify(post));

            let index = getSlicingIndex(GRPC_post.position.latitude, GRPC_post.position.longitude);



            let metaData = new DisasterMetaDataModel({
                _id: "any",
                isActive: false,
                latitude: GRPC_post.position.latitude,
                longitude: GRPC_post.position.longitude,
                latitudeIndex: index.latitude,
                longitudeIndex: index.longitude,
                radius: GRPC_post.radius,
                numOfPost: 1,
            });

            let disasterInfo: DisasterInfoDoc = new DisasterInfoModel({

                position: GRPC_post.position,

                startAt: Date.now(),
                endAt: Date.now() + 1000 * 60 * 60,
                severity: GRPC_post.severity,
                confidence: GRPC_post.confidence,

                numOFlatitude: GRPC_post.position.latitude,
                numOFlongitude: GRPC_post.position.longitude,
                severity_array: [GRPC_post.severity],
                numLikes: GRPC_post.numLikes,
                numDisLikes: GRPC_post.numDisLikes,
                numComments: GRPC_post.numComments

            });

            if (GRPC_post.type == 1) {
                disasterController.disasterAnalysis(disasterInfo, metaData);
            }
            else {
                // edit disaster 
            }
        }

    }
    else {
        DELAY = 1000;
    }

    setTimeout(start, DELAY);
}






export async function startAnalyser() {

    await initDb();
    disasterController = new DisasterController(db);
    startTime = Date.now();
    start();
    console.log("start analyser");
    DELAY = 1000;

}





