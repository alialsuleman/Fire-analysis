
import { Schema, model } from 'mongoose';




export interface DisasterMetaDataDoc extends Document {
    _id: string,
    isActive: boolean,
    latitude: number,
    longitude: number,
    latitudeIndex: number,
    longitudeIndex: number,
    radius: number,
    numOfPost: number,
}


const DisasterMetaDataSchema = new Schema({
    _id: String,
    isActive: Boolean,
    latitude: Number,
    longitude: Number,
    latitudeIndex: Number,
    longitudeIndex: Number,
    radius: Number,
    numOfPost: Number,
})



DisasterMetaDataSchema.index({ 'latitudeIndex': 1, 'longitudeIndex': 1 });
export const DisasterMetaDataModel = model<DisasterMetaDataDoc>('DisasterMetaData', DisasterMetaDataSchema);

