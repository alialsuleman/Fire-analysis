



export interface PureDisaster {
    isActive: boolean,
    position: {
        latitude: number,
        longitude: number,
        address: string,
        state: string,
        city: string,
        country: string
    },
    radius: number,
    startAt: Date,
    endAt: Date,
    severity: number, ///من اليوزر
    confidence: number, //// من تحليل البوست 
}





export interface CreateDisaster extends PureDisaster { // to graphdatebase api  
    postIds: string[],
}



export interface MergeDisaster extends PureDisaster { // // to graphdatebase api  
    Disasters_id: string[],
    postIds: string[],
}


export interface Disaster extends PureDisaster { /// to store in mongodb database 
    _id: string,
    latitudeIndex: number,
    longitudeIndex: number,
    numOfPost: number,
    numOFlatitude: number,
    numOFlongitude: number,
    confidence_array: {
        fisrt: number,
        second: number,
        third: number,
        fourth: number
    }
}
