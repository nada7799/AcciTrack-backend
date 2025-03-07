import { firestore } from "firebase-admin";
import { Collection } from "fireorm";

@Collection('active_users')
export class ActiveUsers{
    id : string;
    location : {geopoint: firestore.GeoPoint; 
                geohash: string; };
    fcmToken: string;
    lastUpdated : firestore.Timestamp;
}