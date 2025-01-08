import { getSlicingIndex } from "../../analyser";
import { StaticSlice } from "../../datastructure";
import { IdPool } from "../../datastructure/Queues/IdPool";
import { SegmentTree } from "../../datastructure/segmentTree/segmentTree";
import { Disaster, MongodbPost } from "../../shared";
import { DisasterDao, PostDao } from "../dao";
import { DataStore } from "../dataStore";
import { DisasterDb } from "../mongodb/db/disasterDb";


interface Slice_index {
    x: number, y: number
}

export class DisasterCache implements DisasterDao {


    disasterDB: DisasterDb = new DisasterDb();
    worldSliceing: StaticSlice[][] = [[]];

    idPool: IdPool;
    map_sliceIndex_to_segIndex: number[][] = [[]];
    map__segIndex_to_sliceIndex: Slice_index[] = [];

    segmentTree: SegmentTree;

    constructor() {
        this.initWorldSlicingArray();

        this.idPool = new IdPool(40001);
        this.segmentTree = new SegmentTree(400001);
    }
    async getById(id: string): Promise<Disaster | null | undefined> {
        return await this.disasterDB.getById(id);
    }


    initWorldSlicingArray() {
        console.log("init world array");
        for (let i = 0; i <= 40000; i++) {
            this.worldSliceing[i] = [];
            this.map_sliceIndex_to_segIndex[i] = [];
        }
    }





    __remove_item(index: number): void {

        this.idPool.add(index);
        let ind_x = this.map__segIndex_to_sliceIndex[index].x;
        let ind_y = this.map__segIndex_to_sliceIndex[index].y;
        // this.worldSliceing[ind_x][ind_y] = undefined;
    }

    __remove_expired_ttls(): void {
        let ret = this.segmentTree.query(0, 400000);
        let mn = ret.value;
        let index = ret.index;
        this.segmentTree.updateTreeNode(index, -1 * mn);
        this.__remove_item(index);
    }



    __evict(): void {
        this.__remove_expired_ttls();
    }






    async get_slice(ind_x: number, ind_y: number): Promise<StaticSlice> {
        let need: boolean = true;
        if (this.worldSliceing[ind_x][ind_y] instanceof StaticSlice) need = false;
        console.log(ind_x + " " + ind_y + " " + need);
        if (need) {

            let index = this.idPool.front();
            console.log(index);
            while (index == -1) {
                this.__evict();
                index = this.idPool.front();
            }
            this.map__segIndex_to_sliceIndex[index] = {
                x: ind_x,
                y: ind_y
            }
            this.map_sliceIndex_to_segIndex[ind_x][ind_y] = index;

            this.worldSliceing[ind_x][ind_y] = await StaticSlice.build(ind_x, ind_y);

        }


        let index = this.map_sliceIndex_to_segIndex[ind_x][ind_y];
        this.segmentTree.updateTreeNode(index, 1);

        //@ts-ignore
        return this.worldSliceing[ind_x][ind_y];

    }


    async createDisaster(disaster: Disaster): Promise<void> {
        let ind = getSlicingIndex(disaster.position.longitude, disaster.position.latitude);
        let ind_x = ind.x;
        let ind_y = ind.y;

        // if (this.worldSliceing[ind_x][ind_y] instanceof StaticSlice) {
        //     this.worldSliceing[ind_x][ind_y].disaster.push(disaster);
        // }

        await this.disasterDB.createDisaster(disaster);
    }
    async updateDisaster(disaster: Disaster): Promise<void> {

        await this.disasterDB.updateDisaster(disaster);
    }
    async deleteDisaster(id: string): Promise<void> {

        await this.disasterDB.deleteDisaster(id);
    }
    async getAllDisaster(): Promise<Disaster[]> {

        return await this.disasterDB.getAllDisaster();
    }
    async updateOrCreate(disaster: Disaster): Promise<void> {

        await this.disasterDB.updateOrCreate(disaster);
    }
    async getWithRange(x1: number, y1: number, x2: number, y2: number): Promise<Disaster[]> {
        return await this.disasterDB.getWithRange(x1, y1, x2, y2);
    }
    async deleteOldDisasterCreateNew(disaster: Disaster): Promise<void> {

        await this.disasterDB.deleteOldDisasterCreateNew(disaster);
    }
    async getSliceByindex(x: number, y: number): Promise<Disaster[]> {

        return await this.disasterDB.getSliceByindex(x, y);
    }


    async getAllDisasterInRange(x0: number, y0: number, x1: number, y1: number, level: number, numOfSkip: number): Promise<Disaster[]> {
        return await this.disasterDB.getAllDisasterInRange(x0, y0, x1, y1, level, numOfSkip);
    }
    async getMaxDisasterid(): Promise<number> {
        return await this.disasterDB.getMaxDisasterid();
    }





}

/*

latitudeIndex
9910
longitudeIndex
19920
numOFlatitude
0.00311
numOFlongitude
24
numOfPost
24

*/