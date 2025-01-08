import path from 'path'
import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader'
import { ProtoGrpcType } from './proto/event'
import { Disaster } from './proto/ndmsRpcEvent/Disaster'
import { Timestamp } from './proto/google/protobuf/Timestamp';
import { Post } from './proto/ndmsRpcEvent/Post'
import { distanceBetweenTwoPoint } from './datastructure'

const PORT = 8082
const PROTO_FILE = './proto/event.proto'

const packageDef = protoLoader.loadSync(path.resolve(__dirname, PROTO_FILE))
const grpcObj = (grpc.loadPackageDefinition(packageDef) as unknown) as ProtoGrpcType


const client = new grpcObj.ndmsRpcEvent.Event(
    `0.0.0.0:${PORT}`, grpc.credentials.createInsecure()
)

const deadline = new Date()
deadline.setSeconds(deadline.getSeconds() + 5)
client.waitForReady(deadline, (err) => {
    if (err) {
        console.error(err)
        return
    }
    onClientReady()
})





let cnt = 50;
const createdAtTimestamp: Timestamp = {
    seconds: 123123,
    nanos: 1231231
};


let id = 100000700;
let posts: Post[] = [];
let Sum_confidence = 0, Sum_lat = 0, Sum_log = 0, num = 0;
let S: number[] = [];
for (let i = 0; i <= 10; i++) {
    S[i] = 0;
}


let like = 0, comment = 0, dislike = 0;
function createRandomData(n: number) {
    console.log("create random data");

    // حدود تقريبية لسوريا
    let minLat = 35.0;
    const maxLat = 37.5;
    const minLng = 38.5;
    const maxLng = 42.0;
    let randomLat = minLat;
    let randomLng = minLng;
    for (let i = 0; i < n; i++) {
        randomLat = minLat + Math.random() * 0.1;
        randomLng = minLng + Math.random() * 0.1;
        let randomC = Math.floor(Math.random() * 10) + 1;
        let randomS = Math.floor(Math.random() * 10) + 1;


        let randomLikes = Math.floor(Math.random() * 10) + 1;
        like += randomLikes;

        let randomDiss = Math.floor(Math.random() * 10) + 1;
        dislike += randomDiss;

        let randomComments = Math.floor(Math.random() * 10) + 1;
        comment += randomComments;


        num++;
        Sum_lat += randomLat;
        Sum_log += randomLng;
        Sum_confidence += randomC;
        S[randomS]++;

        //minLat += 0.01;
        //  console.log("dis " + distanceBetweenTwoPoint({ x: randomLng, y: randomLat, radius: 0 }, { x: randomLng, y: randomLat - 0.01, radius: 0 }) + " raduis " + (999 * 2));

        posts.push({
            type: 1,
            id: `${id++}`,
            position: {
                address: "any",
                country: "Syria",
                city: "any",
                state: "any",
                longitude: randomLng,
                latitude: randomLat
            },
            radius: 999,
            severity: randomS,
            confidence: randomC,
            createdAt: { seconds: Math.floor(Date.now() / 1000) + i * 6, nanos: Date.now() % 1000 },
            numLikes: randomLikes,
            numDisLikes: randomDiss,
            numComments: randomComments
        });
    }
}



function onClientReady() {

    createRandomDate(50);
    const call = client.sendEvent();


    for (let x of posts) {
        // console.log(x.id);

        call.write(x);
    }
    console.log(S);
    Sum_confidence /= num;
    Sum_lat /= num;
    Sum_log /= num;
    console.log("CON " + Sum_confidence);
    console.log("lat " + Sum_lat);
    console.log("LON " + Sum_log);
    console.log("LIKE " + like);
    console.log("DISLIKE " + dislike);
    console.log("COMMENTS " + comment);

    console.log("finish");
    call.on("data", (chunk: Disaster) => {
        //console.log(JSON.stringify(chunk))
        console.log(`get Disaster -  id : ${chunk?.id} with type ${chunk?.type} - using GRPC server`);
        //   console.log(chunk);

    })

}

// call.write({
//     type: 1,
//     id: `i am post ${cnt++}`,
//     position: {
//         address: "any",
//         country: "any",
//         city: "any",
//         state: "any",
//         longitude: 1,
//         latitude: 2
//     },
//     radius: 7,
//     createdAt: createdAtTimestamp,
//     severity: 10,
//     confidence: 11
// })



