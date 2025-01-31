
import { Schema, model } from 'mongoose';




export interface DisasterArchiveDoc extends Document {
    _id: string,
    latitudeIndex: number,
    longitudeIndex: number,
    isActive: boolean,
    position: {
        latitude: number,
        longitude: number,
        address: string,
        state: string,
        city: string,
        country: string
    },
    radius: number,
    startAt: number,
    endAt: number,
    severity: number,
    confidence: number,
    numOfPost: number,
    numOFlatitude: number,
    numOFlongitude: number,
    severity_array: [number],
    numLikes: number,
    numDisLikes: number,
    numComments: number

}








const DisasterArchiveSchema = new Schema({
    _id: String,
    latitudeIndex: Number,
    longitudeIndex: Number,
    isActive: Boolean,
    position: {
        latitude: Number,
        longitude: Number,
        address: String,
        state: String,
        city: String,
        country: String
    },
    radius: Number,
    startAt: Number,
    endAt: Number,
    severity: Number,
    confidence: Number,
    numOfPost: Number,
    numOFlatitude: Number,
    numOFlongitude: Number,
    severity_array: [Number],
    numLikes: Number,
    numDisLikes: Number,
    numComments: Number
})


export const DisasterArchiveModel = model<DisasterArchiveDoc>('DisasterArchive', DisasterArchiveSchema);

