import { MongodbPost, Post } from "../../../shared";
import { PostDao } from "../../dao";
import { PostModel } from "../schema";




export class postDb implements PostDao {


    async getPostDisaster(id: string): Promise<Post[]> {

        return await PostModel.find({ disaster_id: id });
    }


    async getAll(): Promise<Post[]> {
        const posts: Post[] = await PostModel.find();
        // console.log(posts);
        return posts;
    }

    async getPost(_id: string): Promise<MongodbPost | null> {
        return await PostModel.findById(_id);
    }

    async addPost(post: MongodbPost): Promise<void> {
        const newPost = new PostModel(post);
        await newPost.save();
    }

    async updatePost(post: MongodbPost): Promise<void> {
        const filter = { _id: post._id };
        const update = {
            $set: {
                disaster_id: post.disaster_id,
                position: post.position,
                radius: post.radius,
                createdAt: post.createdAt,
                severity: post.severity,
                confidence: post.confidence,
                numLikes: post.numLikes,
                numDisLikes: post.numDisLikes,
                numComments: post.numComments
            }
        };
        const options = { upsert: true };

        await PostModel.findOneAndUpdate(filter, update, options);
    }
    async updatePostsDisaster(lastDisasterId: string, newDisasterId: string): Promise<void> {

        const updateOperation = {
            $set: { disaster_id: newDisasterId }
        };
        // Define the query to match posts with Disaster_id equal to 'x'
        const query = { disaster_id: lastDisasterId };
        // Perform the update operation
        await PostModel.updateMany(query, updateOperation);
    }



}