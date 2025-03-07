import { getRepository, IRepository } from "fireorm";
import { ActiveUsers } from "./active-users.entity";

export class ActiveUsersRepository{
    private repository : IRepository<ActiveUsers>;
    constructor(){
        this.repository = getRepository(ActiveUsers);
    }

    async create(user:ActiveUsers){
        return this.repository.create(user);
    }

    async update(user:ActiveUsers){
        return this.repository.update(user);
    }

    async deleteActiveUser(id:string){
        this.repository.delete(id);
    }

    async getActiveUserById(id:string){
        return this.repository.findById(id);
    }
}