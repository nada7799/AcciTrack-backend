import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from './user-management.repository';
import { CreateUserDto } from 'src/dtos/create-user.dto';

@Injectable()
export class UserManagementService {
    constructor(private userRepository : UserRepository){}
    // guest mode only 
    async createUser(){

    }
    // not guest mode
    async signUp(createUser:CreateUserDto){

    }
    // not guest mode
    async signIn(email:string , password:string){

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
        return user.uploadsId;
    }





}
