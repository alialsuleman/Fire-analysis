const path = require('path')
import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader'
import { ProtoGrpcType } from './proto/event'
import { EventHandlers } from './proto/ndmsRpcEvent/Event';
import { Post, Post__Output } from './proto/ndmsRpcEvent/Post';
import { Timestamp } from './proto/google/protobuf/Timestamp';
import { Disaster } from './proto/ndmsRpcEvent/Disaster';
import { disasterQueue, sharedPostsQueue } from './datastructure/Queues';

const PORT = 8082
const PROTO_FILE = './proto/event.proto'

const packageDef = protoLoader.loadSync(path.resolve(__dirname, PROTO_FILE))
const grpcObj = (grpc.loadPackageDefinition(packageDef) as unknown) as ProtoGrpcType
const randomPackage = grpcObj.ndmsRpcEvent;

export function startGrpcServer() {
    const server = getServer()

    server.bindAsync(`0.0.0.0:${PORT}`, grpc.ServerCredentials.createInsecure(),
        (err, port) => {
            if (err) {
                console.error(err)
                return
            }
            console.log(`Your server as started on port ${port}`)
        })
}


function getServer() {
    const server = new grpc.Server()
    server.addService(randomPackage.Event.service, {
        sendEvent: (call) => {

            call.on("data", (req: Post) => {

                sharedPostsQueue.add(req);
                console.log("QUEUE" + sharedPostsQueue.getSize())
            })

            start(call);

            call.on("end", () => {
                call.end();
            })
        }
    } as EventHandlers)

    return server
}

let DELAY = 1;

function start(call: grpc.ServerDuplexStream<Post__Output, Disaster>) {

    if (disasterQueue.getSize()) {
        DELAY = 1;
        let disaster = disasterQueue.front();
        //  console.log(`send Disaster id : ${disaster?.id} using GRPC server`);

        if (disaster) {
            // let yy = disaster.severity;
            // disaster.severity = disaster.confidence;
            // disaster.confidence = yy;
            call.write(disaster);
        }
    }
    else DELAY = 1000;
    setTimeout(function () {
        start(call);
    }, DELAY);

}























