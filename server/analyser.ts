//import { postQueue } from "./Queues";
import { initDb } from "./dataStore";
//import { Location } from './datastructure';
import { ANALYSER_DELAY, DEGREE_IN_KM } from "./env";
import { Slice } from "./datastructure/slice";
import { Post } from "./shared";
// ///  nx run-many --target=serve --all

// //sudo systemctl status mongod

import { disasterQueue, sharedPostsQueue } from "./Queues";








let worldSliceing: Slice[][] = [[]];
function initWorldSlicingArray() {
    console.log("innit world array");

    for (let i = 0; i <= 20000; i++)worldSliceing[i] = [];
}


function getSlicingIndex(x: number, y: number) {
    let latitudeIndex = Math.floor(x * DEGREE_IN_KM);
    let longitudeIndex = Math.floor(y * DEGREE_IN_KM);
    return {
        x: latitudeIndex,
        y: longitudeIndex
    }
}


let startTime = Date.now();
let endTime = Date.now();
let sumTime: number = 0;

let DELAY = 5000;







export async function startAnalyser() {


    initWorldSlicingArray();
    await initDb();

    startTime = Date.now();
    console.log("start analaysis");
    DELAY = 1000;
    start();

}






async function start() {

    let databaseTime = 0;



    if (sharedPostsQueue.getSize()) {
        DELAY = 1;
        let post = sharedPostsQueue.front();
        if (post) {

            console.log(`Post analysis - id : ${post.id}`);
            let index = getSlicingIndex(post.position.latitude, post.position.longitude);
            let need: boolean = true;
            if (worldSliceing[index.x][index.y] instanceof Slice) need = false;
            if (need) {
                worldSliceing[index.x][index.y] = new Slice(index.x, index.y);
                await worldSliceing[index.x][index.y].getData()
            }
            const ppostt: Post = {
                _id: post.id,
                position: post.position,
                radius: post.radius,
                createdAt: +post.createdAt.seconds * 1000,
                severity: post.severity,
                confidence: post.confidence
            }
            if (post.type == 0) {
                databaseTime += await worldSliceing[index.x][index.y].getOrcreateDisaster(ppostt);
            }
            else {
                await worldSliceing[index.x][index.y].editDisaster(ppostt);
            }
        }

    }
    else DELAY = 1000;

    setTimeout(start, DELAY);
}




