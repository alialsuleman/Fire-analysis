import { Post } from "../../proto/ndmsRpcEvent/Post";




class PostsQueue {
    private static instance: PostsQueue;
    private queue: Post[];

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

    add(value: Post) {
        this.queue.push(value);
    }

    front(): Post | undefined {
        return this.queue.shift();
    }

    getSize(): number {
        return this.queue.length;
    }

    display(): Post[] {
        return this.queue;
    }
}

export const sharedPostsQueue = PostsQueue.getInstance();