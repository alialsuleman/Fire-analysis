
import { assiVAlue } from "../datastructure";
import { MX_DISASTER_ID } from "../env";
import { DisasterDao, PostDao } from "./dao";
import { DataStore } from "./dataStore";
import { NoSqlDataStore } from "./mongodb";





export let db: DataStore;
export async function initDb() {
    db = await new NoSqlDataStore().openDb();
    MX_DISASTER_ID[0] = await db.disasterDB.getMaxDisasterid();
    assiVAlue(MX_DISASTER_ID[0]);
} 