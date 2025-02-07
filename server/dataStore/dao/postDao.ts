import { MongodbPost, Post } from '../../shared/post';
import { PostDoc } from '../mongodb/schema';



export interface PostDao {

    addPost(post: PostDoc): Promise<void>;

    getAll(): Promise<PostDoc[]>;


    updatePostsDisaster(lastDisasterId: string, newDisasterId: string): Promise<void>;

}