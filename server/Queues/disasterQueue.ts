
import { Disaster as GrpcDisaster } from "../proto/ndmsRpcEvent/Disaster";
export class DisasterQueue {
    queue: any = [];
    add(value: GrpcDisaster) {
        this.queue.push(value);
    }
    front() {
        return this.queue.shift();
    }
    getSize() {
        return this.queue.length;
    }
}


export let disasterQueue = new DisasterQueue();









