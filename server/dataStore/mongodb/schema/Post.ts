import { Schema, model } from 'mongoose';


const PostSchema = new Schema({
    _id: String,
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
export const PostModel = model('Post', PostSchema);

