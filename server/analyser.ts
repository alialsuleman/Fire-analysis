import { db, initDb } from "./dataStore";

import { ANALYSER_DELAY, DEGREE_IN_KM, latitudeShift, longitudeShift, MX_DISASTER_ID } from "./env";
import { Post } from "./shared";
import { disasterQueue, sharedPostsQueue } from "./datastructure/Queues";
import { DisasterMetaDataDoc } from "./dataStore/mongodb/schema";
import { DisasterController } from "./controllers/disasterController";
import { DisasterInfoDoc, DisasterInfoModel, DisasterMetaDataModel } from "./dataStore/mongodb/schema/Disaster";





// slice with size 1 km ^2
export function getSlicingIndex(latitude: number, longitude: number) {
    let latitudeIndex = Math.floor((latitude * DEGREE_IN_KM + latitudeShift));
    let longitudeIndex = Math.floor((longitude * DEGREE_IN_KM + longitudeShift));
    return {
        longitude: longitudeIndex,
        latitude: latitudeIndex
    }
}









let startTime = Date.now();
let endTime = Date.now();
let sumTime: number = 0;

let DELAY = 5000;





async function start(disasterController: DisasterController) {

    ///// some db 

    let databaseTime = 0;

    if (sharedPostsQueue.getSize()) {
        DELAY = 300;
        let post = sharedPostsQueue.front();
        if (post) {



            let index = getSlicingIndex(post.position.latitude, post.position.longitude);



            let metaData = new DisasterMetaDataModel({
                _id: "any",
                isActive: false,
                latitude: post.position.latitude,
                longitude: post.position.longitude,
                latitudeIndex: index.latitude,
                longitudeIndex: index.longitude,
                radius: post.radius,
                numOfPost: 1,
            });

            let disasterInfo: DisasterInfoDoc = new DisasterInfoModel({

                position: post.position,

                startAt: Date.now(),
                endAt: Date.now() + 1000 * 60 * 60,
                severity: post.severity,
                confidence: post.confidence,

                numOFlatitude: post.position.latitude,
                numOFlongitude: post.position.longitude,
                severity_array: [post.severity],
                numLikes: post.numLikes,
                numDisLikes: post.numDisLikes,
                numComments: post.numComments

            });

            if (post.type == 1) {
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
    const disasterController = new DisasterController(db);
    startTime = Date.now();
    start(disasterController);
    console.log("start analyser");
    DELAY = 1000;

}





