import { Disaster } from "../shared";


export class DisasterQueue {
    queue: any = [];
    add(value: Disaster) {
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


















