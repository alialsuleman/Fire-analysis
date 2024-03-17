
import { DisasterDao, PostDao } from "./dao";
import { SqlDataStore } from "./mongodb";


export interface DataStore extends DisasterDao, PostDao { }


export let db: DataStore;
export async function initDb() {
    db = await new SqlDataStore().openDb();
} 