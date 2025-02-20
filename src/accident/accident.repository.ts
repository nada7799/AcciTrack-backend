import { Injectable } from "@nestjs/common";
import { getRepository, IRepository } from 'fireorm';
import { Accident } from "./accident.entity";
import { firestore } from "firebase-admin";
@Injectable()
export class AccidentRepository{
    private repository:IRepository<Accident>;
    constructor(){
        this.repository=getRepository(Accident);
    }
    // create accident 
    async create(accident:Omit<Accident, 'id'>): Promise<Accident>{
            return this.repository.create(accident);
    }

    async findAccidentById(id : string) : Promise<Accident| null> {
        return this.repository.findById(id);
    }

    async findAllAcidents(): Promise<Accident[]> {
        return this.repository.find();
    }

    async updateAccident(accident: Accident) {
        return this.repository.update(accident);
      }

    async delete(id : string) {
        this.repository.delete(id);
    }

    async findByGeohash(geohash: string[]){
    return this.repository.whereIn("geohash", geohash);
    }

    async findByTime(timeBucket: firestore.Timestamp): Promise<Accident> {
        return this.repository.whereEqualTo("timeBucket", timeBucket.toDate()).findOne();
    }
    

    async findByGeohashAndTime(geohash:string[],timeBucket:firestore.Timestamp): Promise<Accident> {
            const accident = await this.repository.whereIn("geohash",geohash)
            .whereEqualTo("timeBucket",timeBucket.toDate())
            .orderByAscending("geohash")
            .limit(1)
            .find();
            return accident[0] || null;
    }
}