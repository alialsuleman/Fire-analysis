
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
    startAt: Date,
    endAt: Date,
    severity: Number,
    confidence: Number,
    numOfPost: Number,
    numOFlatitude: Number,
    numOFlongitude: Number,
    latitudeIndex: Number,
    longitudeIndex: Number,
    confidence_array: {
        fisrt: Number,
        second: Number,
        third: Number,
        fourth: Number
    }
})

disasterSchema.index({ 'latitudeIndex': 1, 'longitudeIndex': 1 });
export const DisasterModel = model('Disaster', disasterSchema);

