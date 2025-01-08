import { MongodbPost, Post } from '../../../shared/post';



export interface PostDao {

    addPost(post: MongodbPost): Promise<void>;
    updatePostsDisaster(lastDisasterId: string, newDisasterId: string): Promise<void>;
    getPost(_id: string): Promise<MongodbPost | null>;
    updatePost(post: MongodbPost): Promise<void>;
    getAll(): Promise<Post[]>;
    getPostDisaster(id: string): Promise<Post[]>;
}