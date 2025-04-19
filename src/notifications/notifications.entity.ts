import { firestore } from "firebase-admin";
import { Collection } from "fireorm";
@Collection('notifications')
export class Notifications{
    id : string;
    usersIds : string[];
    message : string;
    latitude:number;
    longitude:number;
    status:string;
    createdAt : firestore.Timestamp;
}