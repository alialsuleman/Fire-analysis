
import { Schema, model } from 'mongoose';


export const EdgeSchema = new Schema({

    latitude1: Number,
    longitude1: Number,
    latitude2: Number,
    longitude2: Number,

})

export const EdgeModel = model('Edge', EdgeSchema);


export interface Edge {
    latitude1: number,
    longitude1: number,
    latitude2: number,
    longitude2: number,
}


export async function add(lon1: number, lat1: number, lon2: number, lat2: number) {
    const egde = {
        latitude1: lat1,
        longitude1: lon1,
        latitude2: lat2,
        longitude2: lon2,
    }
    const edge = new EdgeModel(egde);
    await edge.save();
}
export async function getAll() {
    return await EdgeModel.find();
}

