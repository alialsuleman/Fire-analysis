import { Disaster } from '../../shared';
import { DisasterInfoDoc, DisasterMetaDataDoc } from '../mongodb/schema/Disaster';



export interface DisasterDao {

    addDisasterInfo(disasterInfo: DisasterInfoDoc): Promise<string>;
    addDisasterMetaData(disasterMetaData: DisasterMetaDataDoc): Promise<void>;


    getSlice(latitude: number, longitude: number): Promise<DisasterMetaDataDoc[]>;
    getDisasterInfo(_id: string): Promise<DisasterInfoDoc | null>;

    updateDisasterInfo(newDisasterInfo: Partial<DisasterInfoDoc>): Promise<void>;
    updateDisasterMetaData(newDisasterMeta: Partial<DisasterMetaDataDoc>): Promise<void>;


    deleteDisasterInfoById(id: string): Promise<void>;
    deleteDisasterMetaDataById(id: string): Promise<void>;
}




// createDisaster(disaster: Disaster): Promise<void>;
// updateDisaster(disaster: Disaster): Promise<void>;
// deleteDisaster(id: string): Promise<void>;
// getAllDisaster(): Promise<Disaster[]>;
// updateOrCreate(disaster: Disaster): Promise<void>;
// getWithRange(x1: number, y1: number, x2: number, y2: number): Promise<Disaster[]>;
// deleteOldDisasterCreateNew(disaster: Disaster): Promise<void>;
// getSliceByindex(x: number, y: number): Promise<Disaster[]>