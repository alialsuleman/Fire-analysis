import { Disaster, Post } from "../../shared";




export interface Slice {
    getData(): Promise<void>;
    getOrcreateDisaster(event: Post): Promise<number>;
    addDisaster(disaster: Disaster): Promise<void>;
    editDisaster(post: Post): Promise<void>;
    removeDisaster(): Promise<void>;
}