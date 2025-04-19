import { firestore } from 'firebase-admin';
import { Collection } from 'fireorm';

@Collection('users')
export class User{
    id : string;
    email? : string;
    fullName?:string;
    isGuest : boolean;
    phoneNumber? :string;
    uploadsId? : string[];
    accidentsId ?: string[];
    notificationsId? : string[];
    fcmToken?: string;
    createdAt : firestore.Timestamp;
}