
require('dotenv').config();

export const MONGO_URL = process.env.MONGO_URL
export const MONGO_USR = process.env.MONGO_USR
export const MONGO_PAS = process.env.MONGO_PAS

// console.log(MONGO_URL);
// console.log(MONGO_USR);
// console.log(MONGO_PAS);


if (!MONGO_URL) {
    throw new Error('database configration missing ');
    process.exit(1);
}


export const PORT = process.env.PORT ? +process.env.PORT : 3000;
export let ID_QUEUE_SIZE = process.env.ID_QUEUE_SIZE ? +process.env.ID_QUEUE_SIZE : 300;



export let ANALYSER_DELAY: number[] = [];
ANALYSER_DELAY.push(process.env.ANALYSER_DELAY ? +process.env.ANALYSER_DELAY : 1000000);

export let MIN_REQUIRE_COMMEN_AREA = process.env.MIN_REQUIRE_COMMEN_AREA ? +process.env.MIN_REQUIRE_COMMEN_AREA : 30;
export let DEGREE = 111000;
export let DEGREE_IN_KM = DEGREE / 1000;

export let FIRE_ACTIVATION_RATE = 5;
/// process.env.MIN_REQUIRE_COMMEN_AREA ? +process.env.MIN_REQUIRE_COMMEN_AREA :

export let ADD_TIME_TO_DISASTER_END = 10;

export let displayLevel1 = 10;
export let displayLevel2 = 100;
export let displayLevel3 = 1000;

export let latitudeShift = 90 * DEGREE_IN_KM + 10;
export let longitudeShift = 180 * DEGREE_IN_KM + 10;


export const MX_DISASTER_ID = [10000000];

export const SEVERITY_ARRAY_SIZE = 10;