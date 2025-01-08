//import { postQueue } from "./Queues";
import { db, initDb } from "./dataStore";
//import { Location } from './datastructure';
import { ANALYSER_DELAY, DEGREE_IN_KM, latitudeShift, longitudeShift, MX_DISASTER_ID } from "./env";
import { assiVAlue, StaticSlice } from "./datastructure/slicing/staticSlicing/StaticSlice";
import { Post } from "./shared";
import { disasterQueue, sharedPostsQueue } from "./datastructure/Queues";
import { Slice } from "./datastructure/slicing/slice";
// ///  nx run-many --target=serve --all

// //sudo systemctl status mongod





export function getSlicingIndex(x: number, y: number) {
    let latitudeIndex = Math.floor((y * DEGREE_IN_KM + latitudeShift) / 100);
    let longitudeIndex = Math.floor((x * DEGREE_IN_KM / 100 + longitudeShift) / 100);
    return {
        x: longitudeIndex,
        y: latitudeIndex
    }
}









let startTime = Date.now();
let endTime = Date.now();
let sumTime: number = 0;

let DELAY = 5000;





async function start() {

    let databaseTime = 0;
    // await db.postDB.updatePostsDisaster("10000019", "0000");
    //console.log("ok");
    //  console.log("sharedPostsQueue + " + sharedPostsQueue.getSize())

    // CON 5.44
    // lat 35.04501173064739
    // LON 38.553216064778304
    // finish


    if (sharedPostsQueue.getSize()) {
        DELAY = 300;
        let post = sharedPostsQueue.front();
        if (post) {




            const ppostt: Post = {
                _id: post.id,
                position: post.position,
                radius: post.radius,
                createdAt: +post.createdAt.seconds * 1000,
                severity: post.severity,
                confidence: post.confidence,
                numLikes: post.numLikes,
                numDisLikes: post.numDisLikes,
                numComments: post.numComments ,
            }
            if (post.numLikes ) ppostt.numLikes =  post.numLikes ; 
            else  ppostt.numLikes =0 ;

            if (post.numDisLikes ) ppostt.numDisLikes =  post.numDisLikes ; 
            else  ppostt.numDisLikes =0 ;
            if (post.numComments ) ppostt.numComments =  post.numComments ; 
            else  ppostt.numComments =0 ;



            let index = getSlicingIndex(post.position.longitude, post.position.latitude);
            //
            //    console.log(index);
            let slice = await db.disasterDB.get_slice(index.x, index.y);

            //console.log(slice.disaster);


            if (post.type == 1) {
                databaseTime += await slice.getOrcreateDisaster(ppostt);
            }
            else {
                await slice.editDisaster(ppostt);
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
    startTime = Date.now();
    start();
    console.log("start analyser");
    DELAY = 1000;

}





