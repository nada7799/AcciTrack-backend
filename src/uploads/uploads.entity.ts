import { firestore } from "firebase-admin";
import { Collection } from "fireorm";
@Collection('uploads')
export class Uploads{
    id: string;
    userId : string;
    accidentId? : string;
    location : {longitude: number , latitude : number};
    geohash : string;
    isGuestUpload : boolean;
    timeBucket : firestore.Timestamp;
    createdAt: firestore.Timestamp;
    updatedAt: firestore.Timestamp;
    photoURLs : string[];
    
}