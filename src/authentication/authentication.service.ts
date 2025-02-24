import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { User } from 'src/user-management/user-management.entity';
import { UserRepository } from 'src/user-management/user-management.repository';

@Injectable()
export class AuthenticationService {
      // constructor(private userRepository:UserRepository){}

      // i removed all the createCustomToken because we do not need it in the backend
      /*
      the firebase authentication takes care of creating a token , refresh token and session managment and also 
      user authentication , it also verifies the token and uses the refresh token automatically if the idToken expired
      it takes care of all the token logic so we do not need to worry about it
      we might just verify the token just in case , it is created and verified in the frontend but we verify it here as an 
      extra step
      */
    async signUp(email:string , password:string){
        try{
            const userRecord = await admin.auth().createUser({
                email: email,
                password: password
            });
            return {uid: userRecord.uid , isGuest: false}
        }
        catch(err){
            throw new UnauthorizedException(err.message);
        }
    }
    async verifyToken(token: string){
      try{
        const decodedUser = await admin.auth().verifyIdToken(token);
        return decodedUser;
      }
      catch(error){
        throw new UnauthorizedException(error.message);
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
  
  // anonymous authentication
  async signInAsGuest(){
    try{
      // create the guest user from the firbase authentication service that gives it a unique UID 
      const guestUser = await admin.auth().createUser({displayName:"Guest"});
      // create a user with this unique UID to save in the firestore database
      
      return {uid: guestUser.uid , isGuest: true}
    }
    catch(error){
        throw new UnauthorizedException(error.message);
    }
  }

  async deleteUser(id:string){
    await admin.auth().deleteUser(id);
  }

  async logout(id:string){
    await admin.auth().revokeRefreshTokens(id);
  }
}
