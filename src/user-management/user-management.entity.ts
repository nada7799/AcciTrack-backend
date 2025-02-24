import { firestore } from 'firebase-admin';
import { Collection } from 'fireorm';

@Collection('users')
export class User{
    id : string;
    email? : string;
    password?: string;
    lastName?:string;
    firstName?: string;
    isGuest : boolean;
    uploadsId? : string[];
    accidentsId ?: string[];
    notificationsId? : string[];
    fcmToken?: string;
    createdAt : firestore.Timestamp;
}