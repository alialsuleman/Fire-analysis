//import { postQueue } from "./Queues";
import { postQueue } from "./Queues";
import { db, initDb } from "./dataStore";
import { DisasterModel } from "./dataStore/mongodb/schema";
import { Circle, calculateCommonArea, distanceBetweenTwoPoint } from './datastructure';
//import { Location } from './datastructure';
import { Worker } from 'node:worker_threads';
import { ANALYSER_DELAY } from "./env";
import { Post } from "./shared/post";
import { Unit } from "./datastructure/tree/unit";
import { Location } from './datastructure/tree/location';
import { Disaster } from "./shared";
const { v4: uuidv4 } = require('uuid');

///  nx run-many --target=serve --all

//sudo systemctl status mongod


let worldSliceing: Disaster[][] = [[]];


let startTime = Date.now();
let endTime = Date.now();
let sumTime: number = 0;

let id: string[] = [];


function createRandomDate(n: number) {
    let r = 0.00001;
    for (let i = 0; i < n; i++) {
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
        r += 0.00001;

    }
}

function createId(n: number) {
    for (let i = n * 10; i <= n * 10 + n; i++) {
        let s: string = `${i}`;
        id.push(s);
    }
}
function initWorldSlicingArray() {
    for (let i = 0; i <= 20000; i++)worldSliceing[i] = [];
}




export async function startAnalyser() {


    let x = 1.12312312123123123;
    let y = 1.12312312123123123;
    let latitudeIndex = Math.floor(x * 111);
    let longitudeIndex = Math.floor(y * 111);
    console.log(latitudeIndex);
    console.log(longitudeIndex)




    createId(100000);
    initWorldSlicingArray();
    createRandomDate(10000);

    await initDb();








}




