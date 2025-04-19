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
    numberOfInjuries? :number;
    woundCategory?:string[];
    bloodSeverity?:string;
    burnDegree?:string;
    age?:string[];
    gender?:string[];
    createdAt : firestore.Timestamp;
    updatedAt: firestore.Timestamp;
}