import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserRepository } from './user-management.repository';
import { Response } from 'express';
import { CreateUserDto } from 'src/dtos/create-user.dto';
import { AuthenticationService } from 'src/authentication/authentication.service';
import { User } from './user-management.entity';
import { firestore } from 'firebase-admin';
import firebase from 'firebase';
import { UpdateUserDto } from 'src/dtos/updateUser.dto';
import { UploadsRepository } from 'src/uploads/uploads.repository';

@Injectable()
export class UserManagementService {
    constructor(private userRepository : UserRepository, private authService: AuthenticationService, private uploadRepository:UploadsRepository){}
    // guest mode only 
    async createUser(uid:string){
            const existingUser = await this.userRepository.findUserById(uid);
            if(existingUser){
                return  { userId: existingUser.id, isGuest: true };
            }
        const newUser : User = {
            id : uid,
            isGuest:true,
            createdAt: firestore.Timestamp.now()
        }
        await this.userRepository.create(newUser);
        return { userId: uid , isGuest:true };
    }


    // not guest mode
    async signUp(createUser:CreateUserDto){
        if(!createUser.email){
            throw new BadRequestException("Email and password cannot be empty.");
        }
        const existingUser = await this.userRepository.getUserByEmail(createUser.email);
        if(existingUser){
            throw new BadRequestException("this email already exists , do you want to sign in?");
        }
        //const {uid, isGuest} = await this.authService.signUp(createUser.email,createUser.password);
        const user = {
            id: createUser.uid,
            isGuest:false,
            ...createUser,
            createdAt: firestore.Timestamp.now()
        }
        
        await this.userRepository.create(user);
        const uid = createUser.uid;
        return {uid};
    }

    async hashPassword(password:string):Promise<string>{
        const salt=10;
        return await bcrypt.hash(password, salt);
    }

    // guest or non guest mode 
    // this sign in is mostly handeled by front end 
    // the frontend sends the token of the user that has been extracted 
    async signIn(token: string) {
        try {
            const decodedUser = await this.authService.verifyToken(token);
          console.log("decoded user ",decodedUser);
          const userId = decodedUser.uid;
          const email = decodedUser.email;
    
          let user = await this.userRepository.findUserById(userId);
          if (!user) {
            user = {
              id: userId,
              email: email || null,
              isGuest: !email,
              createdAt: firestore.Timestamp.now(),
            };
            await this.userRepository.create(user);
          }
    
    
          return { status: 200, body: { message: 'User signed in' } };
        } catch (error) {
          throw new UnauthorizedException(error.message);
        }
      }


    // not guest mode
    async getUserById(id:string){
        const user= await this.userRepository.findUserById(id);
        if(!user){
            throw new NotFoundException(`user with id ${id} is not found`);
        }
        return user;
    }

    async getUserByEmail(email:string){
        const user= await this.userRepository.getUserByEmail(email)
        return user;
    }


    // not guest mode
    // we will apply paggination here
    async getUploadsOfUser(id: string) {
        const user = await this.userRepository.findUserById(id);
        if (!user) {
            throw new NotFoundException(`User with id ${id} is not found`);
        }
    
        const uploadsId = user.uploadsId || [];
        if (uploadsId.length === 0) {
            return []; // No uploads, return empty array
        }
    
        return this.uploadRepository.getUploadsOfUser(uploadsId);
    
    }

    async upgradeGuest(createUser:CreateUserDto){
        const user = await this.userRepository.findUserById(createUser.uid);
        if(!user || !user.isGuest){
            throw new BadRequestException('guest user not found');
        }
        const existingUser = await this.userRepository.getUserByEmail(createUser.email);
        if(existingUser){
            throw new BadRequestException("this email already exists , do you want to sign in?");
        }
        user.email=createUser.email;
        user.fullName = createUser.fullName;
        user.isGuest=false;
        await this.userRepository.update(user);
        return { message: 'Guest upgraded successfully', user };
    }

    async deleteUser(id:string){
        // delete user from firebase authentication service
        try{
        await this.authService.deleteUser(id);

        //delete user from our database
        await this.userRepository.deleteUser(id);
        return { message: 'User deleted successfully' };
        }
        catch(error){
            throw new InternalServerErrorException(error.message);
        }
    }
    // logout for registered users revokes all thier tokens so they have to enter thier email and password again to 
    // get a new token
    async logout(id:string){
        const user = await this.userRepository.findUserById(id);
        if(user.isGuest){
            throw new BadRequestException("logout is only for registered users");
        }
        await this.authService.logout(id);
        return {message: "logout completed"};
    }


    async update(id:string , user:UpdateUserDto){
        const userFound = await this.userRepository.findUserById(id);
        if(!userFound){
            throw new NotFoundException("user does not exist");
        }

        const newUser = {
            ...userFound,
            ...user,
        };
        return await this.userRepository.update(newUser);
    }
}
