
import { Schema, model } from 'mongoose';


const disasterSchema = new Schema({
    _id: String,
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
    latitudeIndex: Number,
    longitudeIndex: Number,
    severity_array: [Number],
    numLikes: Number,
    numDisLikes: Number,
    numComments: Number
})

disasterSchema.index({ 'latitudeIndex': 1, 'longitudeIndex': 1 });
export const DisasterModel = model('Disaster', disasterSchema);

