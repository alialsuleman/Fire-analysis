import { Disaster as GrpcDisaster } from "../../proto/ndmsRpcEvent/Disaster";

export class DisasterQueue {
    private static instance: DisasterQueue;
    private queue: GrpcDisaster[] = [];

    private constructor() { }

    static getInstance(): DisasterQueue {
        if (!DisasterQueue.instance) {
            DisasterQueue.instance = new DisasterQueue();
        }
        return DisasterQueue.instance;
    }

    add(value: GrpcDisaster) {
        this.queue.push(value);
    }

    front(): GrpcDisaster | undefined {
        return this.queue.shift();
    }

    getSize() {
        return this.queue.length;
    }
}

export const disasterQueue = DisasterQueue.getInstance();