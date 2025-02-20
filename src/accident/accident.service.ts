import { Injectable, NotFoundException } from '@nestjs/common';
import { AccidentRepository } from './accident.repository';
import { CreateAccidentDto } from 'src/dtos/create-accident.dto';
import {UpdateAccidentDto} from 'src/dtos/update-accident.dto'
import * as geohash from 'ngeohash';
import { Timestamp } from '@google-cloud/firestore';
import { NotFoundError } from 'rxjs';
import { Accident } from './accident.entity';
import { firestore } from 'firebase-admin';
@Injectable()
export class AccidentService {
    constructor(private accidentRepo : AccidentRepository){}
    // this is only called when there is an upload and we haven't found any matching accidents for it in the cache or the database
    async createAccident(createAccident:CreateAccidentDto){
        // get location for geohashing
       const {longitude , latitude} = createAccident.location;
       const location = createAccident.location;
       /* it creates a hash string of the latitude and longitude , and when we increase the percesion which is the
       third parameter passed , it represents more percise area that means a smaller ares
       the longer the hash , the smaller the area 
       8 -->  38 * 19 */
       const geohashVal = geohash.encode(latitude,longitude,8);
       // now for the bucket time approach
       const bucketSize = 5;
       const now = new Date();
       const time = Math.floor(now.getTime() / (bucketSize * 60 * 1000)) * (bucketSize* 60 * 1000);
       const timeBucket = Timestamp.fromDate(new Date(time));
       // create new accident
       const accident = {
        location : location,
            geohash: geohashVal,
            timeBucket : timeBucket,
            ...createAccident,
            createdAt : firestore.Timestamp.now(),
            updatedAt: firestore.Timestamp.now()
       }
      const returnedAccident = await this.accidentRepo.create(accident);
      return returnedAccident;

    }
        //this is called each time we find an upload that is close to an accident
    async updateAccident(id:string,updateAccidentDto: UpdateAccidentDto){
            const accident= await this.accidentRepo.findAccidentById(id);
            if(!accident){
                throw new NotFoundException("accident not found");
            }
        const updatedAccident : Accident = {
                ...accident,
                ...updateAccidentDto,
                updatedAt : firestore.Timestamp.now()
            }
            await this.accidentRepo.updateAccident(updatedAccident);
    }
    // function to search in the accidents collection for the nearst accident to this upload
    // if found it is returned , if not it returns null
    async findNearAccidents(geohashVal:string[], timeBucket:firestore.Timestamp){
            const accident = await this.accidentRepo.findByGeohashAndTime(geohashVal,timeBucket);
            return accident;
    }
    async deleteAccident(id:string){
        const accident = await this.accidentRepo.findAccidentById(id);
        if(accident){
            await this.accidentRepo.delete(id);
        }
    }

    async findAccidentById(id:string):Promise<Accident>{
        const accident = await this.accidentRepo.findAccidentById(id);
        if(!accident){
            throw new NotFoundException("accident not found by id");
        }
        return accident;
    }

}
