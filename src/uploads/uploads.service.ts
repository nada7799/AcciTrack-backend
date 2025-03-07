import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUploadsDto } from 'src/dtos/create-uploads.dto';
import { UploadsRepository } from './uploads.repository';
import { AccidentService } from 'src/accident/accident.service';
import * as geohash from 'ngeohash';
import { Timestamp } from '@google-cloud/firestore';
import { RedisService } from 'src/redis/redis.service';
import { Accident } from 'src/accident/accident.entity';
import { CreateAccidentDto } from 'src/dtos/create-accident.dto';
import { Uploads } from './uploads.entity';
import { firestore } from "firebase-admin";
import { UpdateAccidentDto } from 'src/dtos/update-accident.dto';
@Injectable()
export class UploadsService {
        constructor(private uploadRepository:UploadsRepository,private accidentService: AccidentService,private redisService : RedisService){}


async createUpload(uploadDto:CreateUploadsDto):Promise<Uploads>{

            // creating the gohash of the upload
        const location = uploadDto.location;

        const geohashVal = geohash.encode(location.latitude,location.longitude,8);
        
            // creating the timebucket of the upload
        const bucketSize =20;
        const now = new Date();
            const time = Math.floor(now.getTime() / (bucketSize * 60 * 1000)) * (bucketSize* 60 * 1000);
        const timeBucket = Timestamp.fromDate(new Date(time));

                //create the upload and save it database
                        const upload={
                                ...uploadDto,
                                geohash:geohashVal,
                                timeBucket:timeBucket,
                                createdAt: firestore.Timestamp.now(),
                                updatedAt: firestore.Timestamp.now()
                        }
                        const createdUpload = await this.uploadRepository.create(upload);
                console.log("upload saved in database")
            //searching the cache for the nearest location
        const cacheAccidentId = await this.redisService.geoSearch("recent-accidents:geo",location.longitude,location.latitude);

        //found in cache
        if(cacheAccidentId){
                const accidentFound:Accident = await this.accidentService.findAccidentById(cacheAccidentId);
                //accidentFound.uploadsId.push(createdUpload.id);
                if(!accidentFound.usersId.includes(createdUpload.userId)){
                        accidentFound.usersId.push(createdUpload.userId);
                }
                const UpdateAccidentDto : UpdateAccidentDto= {
                        uploadsId: createdUpload.id,
                        usersId: accidentFound.usersId
                }
                await this.accidentService.updateAccident(accidentFound.id,UpdateAccidentDto);
                return createdUpload;
        }

        // not found in cache
                // check first if cache has been cleared recently(TODO)

        //create a new accident and put it in the database and in the cache
        console.log(createdUpload)
        const accident:CreateAccidentDto = {
                location:location,
                uploadsId:[createdUpload.id],
                usersId: [createdUpload.userId]
        }
        // save it in database
        const createdAccident = await this.accidentService.createAccident(accident);
        // call API of model
        

        createdUpload.accidentId = createdAccident.id;
        await this.uploadRepository.updateUpload(createdUpload);
        //save it in cache for one hour 
        await this.redisService.geoAdd("recent-accidents:geo",location.longitude,location.latitude,createdAccident.id,3600);
        return createdUpload;
}

async findUploadById(id:string):Promise<Uploads>{
        const foundUplaod = this.uploadRepository.findUploadById(id);
        if(!foundUplaod){
                throw new NotFoundException(`the upload with is ${id} is not found in the database`);
        }
        return foundUplaod;
}

async deleteUpload(id:string){
        this.uploadRepository.deleteUpload(id);
}


}
