import { Position } from "../postion"

export interface Post {
    _id: string
    position: Position
    radius: number
    createdAt: Date
    severity: number
    confidence: number
}

export interface MongodbPost extends Post {
    disaster_id: string;
}


export interface UpdatePost {
    _id: string
    confidence: number
}