import { DataStore } from "../dataStore/dataStore";
import { DisasterInfoDoc, DisasterMetaDataDoc } from "../dataStore/mongodb/schema/Disaster";
import { DEGREE } from "../env";





export class DisasterController {

    constructor(private db: DataStore) {

    }


    async disasterAnalysis(disasterInfo: DisasterInfoDoc, disasterMetaData: DisasterMetaDataDoc): Promise<void> {


        while (true) {
            let disastersMetaData: DisasterMetaDataDoc[] = await this.getDataInRange(disasterMetaData.longitude, disasterMetaData.latitude);


            let disastersInfo: DisasterInfoDoc[] = [];
            let sharedDisaster: DisasterMetaDataDoc[] = [];


            let newLongitude = disasterMetaData.longitude;
            let newLatitude = disasterMetaData.latitude;
            let newRaduis = disasterMetaData.radius;
            let numberOfPost = 1;

            for (let x of disastersMetaData) {
                let distance = this.distanceBetweenTwoDisaster(disasterMetaData, x);
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

                    sharedDisaster.push(x);
                }
            }
            if (sharedDisaster.length == 0) break;



            newLongitude /= numberOfPost;
            newLatitude /= numberOfPost;


            // update new lat , lon , radius , numOfPost; 
            disasterMetaData.longitude = newLongitude;
            disasterMetaData.latitude = newLatitude;
            disasterMetaData.numOfPost = numberOfPost;

            for (let x of sharedDisaster) {
                let distance = this.distanceBetweenTwoDisaster(disasterMetaData, x);
                distance += x.radius;
                disasterMetaData.radius = Math.max(distance, disasterMetaData.radius);
            }
            // end update 


            //delete disaster ;
            for (let x of sharedDisaster) {
                this.deleteDisaster(x._id);
            }
            //end delete disaster ;
            this.createNewDisaster(disasterInfo, disasterMetaData);
        }


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

    distanceBetweenTwoDisaster(disasterMetaData_1: DisasterMetaDataDoc, disasterMetaData_2: DisasterMetaDataDoc): number {

        const ans =
            (disasterMetaData_1.longitude - disasterMetaData_2.longitude) *
            (disasterMetaData_1.longitude - disasterMetaData_2.longitude)
            -
            (disasterMetaData_1.latitude - disasterMetaData_2.latitude) *
            (disasterMetaData_1.latitude - disasterMetaData_2.latitude)

            ;

        return DEGREE * ans;
    }


}