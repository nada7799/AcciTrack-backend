import { firestore } from "firebase-admin";
import { Collection } from "fireorm";
@Collection('notifications')
export class Notifications{
    id : string;
    usersId : string[];
    createdAt : firestore.Timestamp;
    message : string;
}