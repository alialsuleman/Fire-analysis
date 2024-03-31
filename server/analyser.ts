//import { postQueue } from "./Queues";
import { postQueue } from "./Queues";
import { db, initDb } from "./dataStore";
//import { Location } from './datastructure';
import { ANALYSER_DELAY, DEGREE_IN_KM } from "./env";
import { Slice } from "./datastructure/slice";
import { Position } from './shared/postion'
import { Post } from "./shared";
// ///  nx run-many --target=serve --all

// //sudo systemctl status mongod


let worldSliceing: Slice[][] = [[]];


let startTime = Date.now();
let endTime = Date.now();
let sumTime: number = 0;

let DELAY = 5000;
let processedCount = 0; // Counter for processed posts



let id: string[] = [];


function createRandomDate(n: number) {
    console.log("create random data");
    let r = 0.00001;
    for (let i = 0; i < n; i++) {
        if (id[i]) {
            postQueue.add({
                type: 1,
                id: id[i],
                position: {
                    address: "any",
                    country: "any",
                    city: "any",
                    state: "any",
                    longitude: 1,
                    latitude: r
                }
                ,
                radius: 30,
                severity: 10,
                confidence: 1,
                createdAt: { seconds: 123, nanos: 123 }
            });

        }

        r += 0.00001;

    }
}

function createId(n: number) {
    console.log("genrate id ");

    for (let i = n * 10; i <= n * 10 + n; i++) {
        let s: string = `${i}`;
        id.push(s);
    }
}
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



export async function startAnalyser() {



    //     worldSliceing[10][10] = new Slice(0, 0);
    //     if (worldSliceing[10][10] instanceof Slice)
    //         console.log("1111");





    let databaseTime = 0;
    async function init() {

        createId(1000000);
        initWorldSlicingArray();
        createRandomDate(100000);
        await initDb();

        startTime = Date.now();
        console.log("start analaysis  ")
        DELAY = 0;
        start();
    }

    async function start() {
        if (postQueue.getSize()) {
            let post = postQueue.front();
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
                createdAt: new Date(+post.createdAt.seconds),
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


        // processedCount++;
        // if (processedCount === 100000) {
        //     const endTime = Date.now(); // Capture the end time
        //     const processingTime = endTime - startTime; // Calculate the processing time
        //     console.log("number of post : " + 100000);
        //     console.log("Processing time: ", processingTime, "milliseconds");
        //     console.log("database time: ", databaseTime, "milliseconds");
        //     DELAY = 1000000;
        //     console.log(new Date());
        // }
        // else
        setTimeout(start, DELAY);
    }

    setTimeout(init, 10000);
}




