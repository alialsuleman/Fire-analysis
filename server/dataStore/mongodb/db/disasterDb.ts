import { StaticSlice } from "../../../datastructure";
import { Disaster } from "../../../shared";
import { DisasterDao } from "../../dao";
import { DisasterModel } from "../schema";





export class DisasterDb implements DisasterDao {


    async getById(id: string): Promise<Disaster | null | undefined> {
        return await DisasterModel.findOne({ _id: id });
    }


    get_slice(ind_x: number, ind_y: number): Promise<StaticSlice> {
        throw new Error("Method not implemented.");
    }



    async getMaxDisasterid(): Promise<number> {
        let x = await DisasterModel.find().sort({ _id: -1 }).limit(1);
        if (x[0]?._id) return +x[0]._id;
        return 10000000;
    }
    async getWithRange(x1: number, y1: number, x2: number, y2: number): Promise<Disaster[]> {

        return await DisasterModel.find({
            'position.longitude': { "$gte": x1, "$lte": x2 },
            'position.latitude': { "$gte": y1, "$lte": y2 }
        });

    }

    async getSliceByindex(x: number, y: number): Promise<Disaster[]> {
        //  console.log(x + ' ' + y);
        let arr1: Disaster[] = await DisasterModel.find({ longitudeIndex: x, latitudeIndex: y });
        let arr2: Disaster[] = await DisasterModel.find({ longitudeIndex: x + 1, latitudeIndex: y });
        let arr3: Disaster[] = await DisasterModel.find({ longitudeIndex: x, latitudeIndex: y + 1 });
        let arr4: Disaster[] = await DisasterModel.find({ longitudeIndex: x + 1, latitudeIndex: y + 1 });
        let arr5: Disaster[] = await DisasterModel.find({ longitudeIndex: x - 1, latitudeIndex: y });
        let arr6: Disaster[] = await DisasterModel.find({ longitudeIndex: x, latitudeIndex: y - 1 });
        let arr7: Disaster[] = await DisasterModel.find({ longitudeIndex: x - 1, latitudeIndex: y - 1 });
        let farr: Disaster[] = [...arr1, ...arr2, ...arr3, ...arr4, ...arr5, ...arr6, ...arr7];
        return farr;
    }


    async deleteDisaster(id: string): Promise<void> {
        await DisasterModel.deleteOne({ _id: id });
    }
    async getAllDisaster(): Promise<Disaster[]> {
        return await DisasterModel.find();
    }



    async updateOrCreate(disaster: Disaster): Promise<void> {
        const filter = { _id: disaster._id };
        const update = {
            $set: {
                isActive: disaster.isActive,
                position: disaster.position,
                radius: disaster.radius,
                startAt: disaster.startAt,
                endAt: disaster.endAt,
                severity: disaster.severity,
                confidence: disaster.confidence,
                numOfPost: disaster.numOfPost,
                numOFlatitude: disaster.numOFlatitude,
                numOFlongitude: disaster.numOFlongitude,
                severity_array: disaster.severity_array,
                latitudeIndex: disaster.latitudeIndex,
                longitudeIndex: disaster.longitudeIndex,
                numLikes: disaster.numLikes,
                numDisLikes: disaster.numDisLikes,
                numComments: disaster.numComments
            }
        };
        const options = { upsert: true };

        await DisasterModel.findOneAndUpdate(filter, update, options);
    }

    async createDisaster(disaster: Disaster): Promise<void> {
        //   console.log(disaster);
        const dis = new DisasterModel(disaster);
        await dis.save();
    }
    async deleteOldDisasterCreateNew(disaster: Disaster): Promise<void> {
        //   console.log(disaster);
        await this.deleteDisaster(disaster._id);
        const dis = new DisasterModel(disaster);
        await dis.save();
    }

    async updateDisaster(disaster: Disaster): Promise<void> {
        await DisasterModel.updateOne({ _id: disaster._id }, disaster);
    }





    async getAllDisasterInRange(x0: number, y0: number, x1: number, y1: number, level: number, numToSkip: number): Promise<Disaster[]> {

        const disasters = await DisasterModel.find({
            'latitudeIndex': { $gte: y0, $lte: y1 },
            'longitudeIndex': { $gte: x0, $lte: x1 },
            'confidence': { $gte: level }
        })
            .skip(numToSkip)
            .limit(10)
            .lean() // Convert Mongoose documents to plain JavaScript objects
            .exec();

        return disasters as Disaster[];



    }

}