import { ID_QUEUE_SIZE } from '../env';
import { idQueue } from './idQueue';

export * from './circle'
//export * from './tree';
//export * from './idQueue';


//import { Location } from './tree';


//export let treeRoot: Location = new Location(null, "ROOT", 0, 0, 123123123) as Location;


export let queue = new idQueue(ID_QUEUE_SIZE);


/**
 *      TODO 
 *  create api for creating disaster 
 *  create  queue for diasater 
 *  create mongodb  database to add disaster // i need to delete old data from here
 *  it help to search only in the data that is i need 
 * i can create indexing 
 * 
 * 
 * 
 * 
 db.collection.createIndex({ "a": 1, "b": 1 })
  This creates a compound index on fields a and b.   
  db.collection.find({
    "a": { "$gte": l1, "$lte": l2 },
    "b": { "$gte": r1, "$lte": r2 }
})
This query will use the compound index on fields a and b to quickly retrieve the documents that satisfy the conditions







 */

