import { firestore } from 'firebase-admin';
import { Collection } from 'fireorm';

@Collection('users')
export class User{
    id : string;
    email? : string;
    password?: string;
    name?: string;
    isGuest : boolean;
    uploadsId? : string[];
    accidentsId ?: string[];
    notificationsId? : string[]
    createdAt : firestore.Timestamp;
}