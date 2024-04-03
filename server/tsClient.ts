import path from 'path'
import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader'
import { ProtoGrpcType } from './proto/event'
import { Disaster } from './proto/ndmsRpcEvent/Disaster'
import { Timestamp } from './proto/google/protobuf/Timestamp';
import { Post } from './proto/ndmsRpcEvent/Post'

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





let cnt = 100000;
const createdAtTimestamp: Timestamp = {
    seconds: 123123,
    nanos: 1231231
};


let id: string[] = [];
let posts: Post[] = [];

function createRandomDate(n: number) {
    console.log("create random data");
    let r = 0.00001;
    for (let i = 0; i < n; i++) {
        if (id[i]) {
            posts.push({
                type: 0,
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
                createdAt: { seconds: Date.now() / 1000 + i * 6, nanos: Date.now() % 1000 }
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


function onClientReady() {

    createId(2000);
    createRandomDate(1000);
    const call = client.sendEvent();


    for (let x of posts) {
        // console.log(x.id);

        call.write(x);
    }
    call.on("data", (chunk: Disaster) => {
        //console.log(JSON.stringify(chunk))
        console.log(`get Disaster -  id : ${chunk?.id}  - using GRPC server`);

    })

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






}

