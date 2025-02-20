import { firestore } from "firebase-admin";
import { Collection } from "fireorm";

@Collection('accidents')
export class Accident{
    id : string;
    location : {longitude : number , latitude : number};
    geohash: string;
    timeBucket : firestore.Timestamp;
    uploadsId : string[]; 
    usersId: string[];
    createdAt : firestore.Timestamp;
    updatedAt: firestore.Timestamp;
}