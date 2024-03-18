//import { postQueue } from "./Queues";
import { postQueue } from "./Queues";
import { db, initDb } from "./dataStore";
//import { Location } from './datastructure';
import { ANALYSER_DELAY, DEGREE_IN_KM } from "./env";
import { Slice } from "./datastructure/slice";

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

                _id: id[i],
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
                createdAt: new Date()
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


        let post = postQueue.front();

        if (post) {
            // console.log(post);
            let index = getSlicingIndex(post.position.latitude, post.position.longitude);
            let need: boolean = true;
            if (worldSliceing[index.x][index.y] instanceof Slice) need = false;
            if (need) {
                worldSliceing[index.x][index.y] = new Slice(index.x, index.y);
                //// console.log("build Slice ...");
                await worldSliceing[index.x][index.y].getData()
                ///console.log(worldSliceing[index.x][index.y].disaster);
            }
            databaseTime += await worldSliceing[index.x][index.y].getOrcreateDisaster(post);
            processedCount++;
            if (processedCount === 100000) {
                const endTime = Date.now(); // Capture the end time
                const processingTime = endTime - startTime; // Calculate the processing time
                console.log("number of post : " + 100000);
                console.log("Processing time: ", processingTime, "milliseconds");
                console.log("database time: ", databaseTime, "milliseconds");
                DELAY = 1000000;
                console.log(new Date());
            }
        }
        setTimeout(start, DELAY);
    }

    setTimeout(init, 10000);







}




