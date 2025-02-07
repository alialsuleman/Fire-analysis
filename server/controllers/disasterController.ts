import { DataStore } from "../dataStore/dataStore";
import { DisasterInfoDoc, DisasterMetaDataDoc } from "../dataStore/mongodb/schema/Disaster";
import { DEGREE } from "../env";





export class DisasterController {

    constructor(private db: DataStore) {

    }


    async disasterAnalysis(disasterInfo: DisasterInfoDoc, disasterMetaData: DisasterMetaDataDoc): Promise<void> {

        let first = false;
        while (true) {

            let disastersMetaData: DisasterMetaDataDoc[] = await this.getDataInRange(disasterMetaData.longitudeIndex, disasterMetaData.latitudeIndex);

            console.log("numOfD ", disastersMetaData.length);
            let disastersInfo: DisasterInfoDoc[] = [];
            let sharedDisaster: DisasterMetaDataDoc[] = [];


            let newLongitude = disasterMetaData.longitude;
            let newLatitude = disasterMetaData.latitude;

            let numberOfPost = 1;

            for (let x of disastersMetaData) {
                let distance = distanceBetweenTwoDisaster(disasterMetaData, x);
                let mx_dis = x.radius + disasterMetaData.radius;
                if (distance <= mx_dis) {

                    // let d = await this.db.disasterDB.getDisasterInfo(x._id);
                    // if (d) {
                    //     disastersInfo.push(d);
                    // }
                    x.longitude *= x.numOfPost;
                    x.latitude *= x.numOfPost;


                    numberOfPost += x.numOfPost;
                    newLongitude += x.longitude;
                    newLatitude += x.latitude;

                    x.longitude /= x.numOfPost;
                    x.latitude /= x.numOfPost;

                    sharedDisaster.push(x);
                }
            }
            if (sharedDisaster.length == 0) {
                break;
            }


            newLongitude /= numberOfPost;
            newLatitude /= numberOfPost;


            // update new lat , lon , radius , numOfPost; 
            disasterMetaData.longitude = newLongitude;
            disasterMetaData.latitude = newLatitude;
            disasterMetaData.numOfPost = numberOfPost;
            console.log(JSON.stringify(disasterMetaData));
            for (let x of sharedDisaster) {
                let distance = distanceBetweenTwoDisaster(disasterMetaData, x);
                distance += x.radius;
                console.log(
                    JSON.stringify(x), " : ", distance
                )
                disasterMetaData.radius = Math.max(distance, disasterMetaData.radius);
            }
            // end update 


            //delete disaster ;
            console.log("numOfDelete ", sharedDisaster.length);
            for (let x of sharedDisaster) {
                console.log("delete ", x._id);
                this.deleteDisaster(x._id);
            }
            //end delete disaster ;





        }

        await this.createNewDisaster(disasterInfo, disasterMetaData);



    }


    async createNewDisaster(disasterInfo: DisasterInfoDoc, disasterMetaData: DisasterMetaDataDoc): Promise<void> {
        let _id = await this.db.disasterDB.addDisasterInfo(disasterInfo);
        disasterMetaData._id = _id;
        await this.db.disasterDB.addDisasterMetaData(disasterMetaData);
    }

    async deleteDisaster(id: string): Promise<void> {
        await this.db.disasterDB.deleteDisasterInfoById(id);
        await this.db.disasterDB.deleteDisasterMetaDataById(id);
    }


    async getDataInRange(longitude: number, latitude: number): Promise<DisasterMetaDataDoc[]> {
        let arr: DisasterMetaDataDoc[] = [];
        for (let i = -1; i <= 1; i++)
            for (let j = -1; j <= 1; j++) {
                let temp_arr = await this.db.disasterDB.getSlice(latitude + i, longitude + j);
                arr.push(...temp_arr);
            }

        return arr;
    }




}




function distanceBetweenTwoDisaster(disasterMetaData_1: DisasterMetaDataDoc, disasterMetaData_2: DisasterMetaDataDoc): number {
    const lat1 = disasterMetaData_1.latitude, lon1 = disasterMetaData_1.longitude;
    const lat2 = disasterMetaData_2.latitude, lon2 = disasterMetaData_2.longitude;

    var p = 0.017453292519943295;    // Math.PI / 180
    var c = Math.cos;
    var a = 0.5 - c((lat2 - lat1) * p) / 2 +
        c(lat1 * p) * c(lat2 * p) *
        (1 - c((lon2 - lon1) * p)) / 2;

    return 12742 * Math.asin(Math.sqrt(a)) * 1000; // 2 * R; R = 6371 km
}

