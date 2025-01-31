import { DisasterCache } from "./cashing/DisasterCache";
import { DisasterDao, PostDao } from "./dao";







export interface DataStore {
    openDb(): Promise<DataStore>;
    disasterDB: DisasterDao;
    postDB: PostDao;
}