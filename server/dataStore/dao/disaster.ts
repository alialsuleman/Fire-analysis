import { Disaster } from '../../shared';



export interface DisasterDao {

    createDisaster(disaster: Disaster): Promise<void>;
    updateDisaster(disaster: Disaster): Promise<void>;
    deleteDisaster(id: string): Promise<void>;
    getAllDisaster(): Promise<Disaster[]>;
    updateOrCreate(disaster: Disaster): Promise<void>;
    getWithRange(x1: number, y1: number, x2: number, y2: number): Promise<Disaster[]>;
    deleteOldDisasterCreateNew(disaster: Disaster): Promise<void>;


}