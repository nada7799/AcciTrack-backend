import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class AuthenticationService {

    async signUp(email:string , password:string){
        try{
            const userRecord = await admin.auth().createUser({
                email: email,
                password: password
            });
            const token = await admin.auth().createCustomToken(userRecord.uid);
            return {uid: userRecord.uid, token};
        }
        catch(err){
            throw new UnauthorizedException(err.message);
        }
    }

    // Sign in an existing user
  async signIn(email: string, password: string) {
    try {
      // Firebase Auth does NOT provide sign-in with email/password directly in the backend
      // The frontend should authenticate using Firebase SDK, then send the ID token to backend
      throw new UnauthorizedException('Use Firebase SDK to sign in and send ID token to verify.');
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }
  
  async verifyToken(token:string){
    try{
        const decodedToken = await admin.auth().verifyIdToken(token);
        return decodedToken;
    }
    catch(err){
        throw new UnauthorizedException("token in not valid or expired");
    }
  }

  
}
