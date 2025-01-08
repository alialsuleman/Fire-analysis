import { StaticSlice } from '../../../datastructure';
import { Disaster } from '../../../shared';



export interface DisasterDao {
    get_slice(ind_x: number, ind_y: number): Promise<StaticSlice>;
    createDisaster(disaster: Disaster): Promise<void>;
    updateDisaster(disaster: Disaster): Promise<void>;
    deleteDisaster(id: string): Promise<void>;
    getAllDisaster(): Promise<Disaster[]>;
    updateOrCreate(disaster: Disaster): Promise<void>;
    getWithRange(x1: number, y1: number, x2: number, y2: number): Promise<Disaster[]>;
    deleteOldDisasterCreateNew(disaster: Disaster): Promise<void>;
    getSliceByindex(x: number, y: number): Promise<Disaster[]>;
    getAllDisasterInRange(x0: number, y0: number, x1: number, y1: number, level: number, numOfSkip: number): Promise<Disaster[]>;
    getMaxDisasterid(): Promise<number>;
    getById(id: string): Promise<Disaster | null | undefined>;
}
