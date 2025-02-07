import { Post as GRPCPOST } from "../../proto/ndmsRpcEvent/Post";




class PostsQueue {
    private static instance: PostsQueue;
    private queue: GRPCPOST[];

    private constructor() {
        this.queue = [];
        console.log("create new posts Queue");
    }

    static getInstance(): PostsQueue {
        if (!PostsQueue.instance) {
            PostsQueue.instance = new PostsQueue();
        }
        return PostsQueue.instance;
    }

    add(value: GRPCPOST) {
        this.queue.push(value);
    }

    front(): GRPCPOST | undefined {
        return this.queue.shift();
    }

    getSize(): number {
        return this.queue.length;
    }

    display(): GRPCPOST[] {
        return this.queue;
    }
}

export const sharedPostsQueue = PostsQueue.getInstance();