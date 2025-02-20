import { Injectable } from "@nestjs/common";
import { getRepository, IRepository } from "fireorm";
import { Uploads } from "./uploads.entity";

@Injectable()
export class UploadsRepository{
    private repository : IRepository<Uploads>;
    constructor(){
        this.repository = getRepository(Uploads);
    }

    async create(upload: Omit<Uploads,'id'>): Promise<Uploads>{
        return this.repository.create(upload);
    }
    
    async findUploadById(id:string){
        return this.repository.findById(id);
    }

    async updateUpload(upload:Uploads){
        return this.repository.update(upload);
    }

    async deleteUpload(id:string){
        return this.repository.delete(id);
    }

}