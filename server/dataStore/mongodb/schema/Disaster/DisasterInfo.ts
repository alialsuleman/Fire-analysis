import mongoose, { Schema, Document, model } from 'mongoose';



export interface DisasterInfoDoc extends Document {
    position: {
        address: string,
        state: string,
        city: string,
        country: string
    },

    startAt: number,
    endAt: number,
    severity: number,
    confidence: number,

    numOFlatitude: number,
    numOFlongitude: number,
    severity_array: [number],
    numLikes: number,
    numDisLikes: number,
    numComments: number

}

const DisasterInfoSchema = new Schema({
    position: {
        address: String,
        state: String,
        city: String,
        country: String
    },

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


export const DisasterInfoModel = model<DisasterInfoDoc>('DisasterInfo', DisasterInfoSchema);

