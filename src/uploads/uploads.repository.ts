import { Injectable } from "@nestjs/common";
import { getRepository, IRepository } from "fireorm";
import { Uploads } from "./uploads.entity";
import { firestore } from 'firebase-admin';
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

    async getUploadsOfUser(uploadsId: string[]) {
        
        if (uploadsId.length === 0) return [];

        const chunkSize = 10;
        const queries = [];

        for (let i = 0; i < uploadsId.length; i += chunkSize) {
            const chunk = uploadsId.slice(i, i + chunkSize);
            queries.push(
                firestore()
                    .collection("uploads")
                    .where(firestore.FieldPath.documentId(), "in", chunk)
                    .get()
            );
        }

        const results = await Promise.all(queries);
        return results.flatMap(snapshot => snapshot.docs.map(doc => doc.data()));
    }

}