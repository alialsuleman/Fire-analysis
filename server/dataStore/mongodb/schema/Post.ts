import { Schema, model } from 'mongoose';


export interface PostDoc extends Document {

    disaster_id: string,
    position: {
        latitude: number,
        longitude: number,
        address: string,
        state: string,
        city: string,
        country: string
    },
    radius: number,
    createdAt: Date,
    severity: number,
    confidence: number,
    numLikes: number,
    numDisLikes: number,
    numComments: number
}

const PostSchema = new Schema({
    disaster_id: String,
    position: {
        latitude: Number,
        longitude: Number,
        address: String,
        state: String,
        city: String,
        country: String
    },
    radius: Number,
    createdAt: Date,
    severity: Number,
    confidence: Number,
    numLikes: Number,
    numDisLikes: Number,
    numComments: Number
})

PostSchema.index({ 'Disaster_id': 1 });
export const PostModel = model<PostDoc>('Post', PostSchema);

