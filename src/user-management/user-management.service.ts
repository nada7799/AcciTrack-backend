import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserRepository } from './user-management.repository';
import { CreateUserDto } from 'src/dtos/create-user.dto';
import { AuthenticationService } from 'src/authentication/authentication.service';
import { User } from './user-management.entity';
import { firestore } from 'firebase-admin';

@Injectable()
export class UserManagementService {
    constructor(private userRepository : UserRepository, private authService: AuthenticationService){}
    // guest mode only 
    async createUser(guestId?:string){
        if(guestId){
            const existingUser = await this.userRepository.findUserById(guestId);
            if(existingUser){
                return  { userId: existingUser.id, isGuest: true };
            }
        }
        const {uid, isGuest} = await this.authService.signInAsGuest();
        const newUser : User = {
            id : uid,
            isGuest:isGuest,
            createdAt: firestore.Timestamp.now()
        }
        await this.userRepository.create(newUser);
        return { userId: uid , isGuest };
    }


    // not guest mode
    async signUp(createUser:CreateUserDto){
        if(!createUser.email||!createUser.password){
            throw new BadRequestException("Email and password cannot be empty.");
        }
        const existingUser = await this.userRepository.getUserByEmail(createUser.email);
        if(existingUser){
            throw new BadRequestException("this email already exists , do you want to sign in?");
        }
        const {uid, isGuest} = await this.authService.signUp(createUser.email,createUser.password);
        const user = {
            id: uid,
            isGuest,
            ...createUser,
            createdAt: firestore.Timestamp.now()
        }
        user.password = await this.hashPassword(user.password);
        await this.userRepository.create(user);
        return {uid,isGuest};
    }

    async hashPassword(password:string):Promise<string>{
        const salt=10;
        return await bcrypt.hash(password, salt);
    }

    // guest or non guest mode 
    // this sign in is mostly handeled by front end 
    // the frontend sends the token of the user that has been extracted 
    async signIn(token: any){
        try{
            // first we verify the token that it is valid
        const decodedUser = await this.authService.verifyToken(token);

        // then we extract user data (he can be a guest or a logged in user)
        const userId = decodedUser.uid;
        const email = decodedUser.email;

        // get the user from our database
        let user = await this.userRepository.findUserById(userId);

        // here we check that the user exists in our database , there can be glitches where the user is in the authentication
        // service of firestore and is registered there with an UID and a valid token but is not stored in our database for some reason
        // so we have to check that he is in our database, if he is not we put him because we are certain that he has a valid token
        if(!user){
            user = {
                id:userId,
                email: email||null,
                isGuest:!email,
                createdAt: firestore.Timestamp.now()
            };
            await this.userRepository.create(user);
        }

        return { user};
    }catch(error){
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


    // not guest mode
    // we will apply paggination here
    async getUploadsOfUser(id:string){
        const user= await this.userRepository.findUserById(id);
        if(!user){
            throw new NotFoundException(`user with id ${id} is not found`);
        }
        return user.uploadsId || [];
    }

    async upgradeGuest(userId:string , createUser:CreateUserDto){
        const user = await this.userRepository.findUserById(userId);
        if(!user || !user.isGuest){
            throw new BadRequestException('guest user not found');
        }
        const existingUser = await this.userRepository.getUserByEmail(createUser.email);
        if(existingUser){
            throw new BadRequestException("this email already exists , do you want to sign in?");
        }
        user.email=createUser.email;
        user.password=createUser.password;
        user.firstName = createUser.firstName;
        user.lastName = createUser.lastName;
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
}
