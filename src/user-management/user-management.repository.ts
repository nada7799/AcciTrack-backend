import { Injectable } from "@nestjs/common";
import { getRepository, IRepository } from "fireorm";
import { User } from "./user-management.entity";
@Injectable()
export class UserRepository{
    private repository:IRepository<User>
    constructor(){
        this.repository = getRepository(User);
    }

    async create(user:User){
        return this.repository.create(user);
    }

    async deleteUser(id:string){
        this.repository.delete(id);
    }

    async findUserById(id:string){
        return this.repository.findById(id);
    }

    async update(user:User){
        return this.repository.update(user);
    }

    async getUserByEmail(email:string){
        return this.repository.whereEqualTo("email", email).findOne();
    }

}