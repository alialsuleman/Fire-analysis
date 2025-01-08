import { Post, UpdatePost } from "../shared/post";





export class PostsQueue {
    queue: any = [];
    add(value: Post) {
        this.queue.push(value);
    }
    front(): Post {
        return this.queue.shift();
    }
    getSize(): number {
        return this.queue.length;
    }
    display(): [] {
        return this.queue;
    }
}
export let postQueue = new PostsQueue();