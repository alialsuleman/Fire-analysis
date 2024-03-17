import { MongodbPost, Post } from '../../shared/post';



export interface PostDao {

    addPost(post: MongodbPost): Promise<void>;
    updatePostsDisaster(lastDisasterId: string, newDisasterId: string): Promise<void>;
}