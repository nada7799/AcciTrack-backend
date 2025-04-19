import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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
import { UserManagementService } from 'src/user-management/user-management.service';
import { UserRepository } from 'src/user-management/user-management.repository';
import { User } from 'src/user-management/user-management.entity';
import axios from 'axios';
@Injectable()
export class UploadsService {
        constructor(private uploadRepository:UploadsRepository
                ,private accidentService: AccidentService
                ,private redisService : RedisService
                , private userRepo:UserRepository){}


async createUpload(uploadDto:CreateUploadsDto, photoURLs:string[]){
        const user:User = await this.userRepo.findUserById(uploadDto.userId);
       // console.log(photoURLs)
        if(!user){
                throw new BadRequestException("user does not exist");
        }
        

            // creating the gohash of the upload
        const location = {latitude: uploadDto.latitude , longitude: uploadDto.longitude};

        const geohashVal = geohash.encode(location.latitude,location.longitude,8);
        
            // creating the timebucket of the upload
        const bucketSize =20;
        const now = new Date();
            const time = Math.floor(now.getTime() / (bucketSize * 60 * 1000)) * (bucketSize* 60 * 1000);
        const timeBucket = Timestamp.fromDate(new Date(time));

                //create the upload and save it database
                        const upload={
                                ...uploadDto,
                                location:location,
                                photoURLs:photoURLs,
                                geohash:geohashVal,
                                timeBucket:timeBucket,
                                createdAt: firestore.Timestamp.now(),
                                updatedAt: firestore.Timestamp.now()
                        }
                const createdUpload = await this.uploadRepository.create(upload);
                //console.log("upload saved in database")
                //console.log(createdUpload.id);
            //searching the cache for the nearest location
       const cacheAccidentId = await this.redisService.geoSearch("recent-accidents:geo",location.longitude,location.latitude);

        // //found in cache
        // if(cacheAccidentId){
        //         const accidentFound:Accident = await this.accidentService.findAccidentById(cacheAccidentId);
        //         //accidentFound.uploadsId.push(createdUpload.id);
        //         if(!accidentFound.usersId.includes(createdUpload.userId)){
        //                 accidentFound.usersId.push(createdUpload.userId);
        //         }
        //         const uploadsId = [createdUpload.id];
        //         const UpdateAccidentDto : UpdateAccidentDto= {
        //                 uploadsId,
        //                 usersId: accidentFound.usersId
        //         }
        //         await this.accidentService.updateAccident(accidentFound.id,UpdateAccidentDto);
        //         if(user.uploadsId){
        //                 user.uploadsId?.push(createdUpload.id);
        //         }
        //         else{
        //                 user.uploadsId = [createdUpload.id];
        //         }
        //         await this.userRepo.update(user);
        //         //console.log("after update");
                
        //         await this.sendToModelAPI(cacheAccidentId, photoURLs,accidentFound.location.longitude,accidentFound.location.latitude);
        //         return createdUpload;
        // }

        // not found in cache
                // check first if cache has been cleared recently(TODO)

        //create a new accident and put it in the database and in the cache
        const accident:CreateAccidentDto = {
                location:location,
                uploadsId:[createdUpload.id],
                usersId: [createdUpload.userId]
        }
        // save it in database
        const createdAccident = await this.accidentService.createAccident(accident);
        // call API of model
        
        if(user.uploadsId){
                user.uploadsId?.push(createdUpload.id);
        }
        else{
                user.uploadsId = [createdUpload.id];
        }
        await this.userRepo.update(user);
        //console.log("after update");
        createdUpload.accidentId = createdAccident.id;
        await this.uploadRepository.updateUpload(createdUpload);
        //save it in cache for one hour 
        await this.redisService.geoAdd("recent-accidents:geo",location.longitude,location.latitude,createdAccident.id,3600);
        await this.sendToModelAPI(createdAccident.id, photoURLs,createdAccident.location.longitude,createdAccident.location.latitude);
        return createdUpload;
        
}




async sendToModelAPI(accidentId: string, photoURLs: string[], longitude:number, latitude:number) {
        const baseUrl = 'https://53f9-34-80-100-146.ngrok-free.app/process-images/';

try {
        const cleanURLs = Array.isArray(photoURLs) ? photoURLs : JSON.parse(photoURLs);

        const payload = {
        urls: cleanURLs
        };

        const response = await axios.post(
                `${baseUrl}?accidentId=${accidentId}&latitude=${latitude}&longitude=${longitude}`
                , payload, {
        headers: {
        'Content-Type': 'application/json'
        },
        timeout: 30000
        });

        console.log(`✅ Model API success for accident: ${accidentId}`);
        console.log('🧠 Model API result:', response.data);

        return response.data;

} catch (error) {
        if (axios.isAxiosError(error)) {
        console.error(`🚨 API Error (${error.response?.status}): ${error.message}`);

        if (error.response) {
        console.error(`Full error response:`, JSON.stringify(error.response.data, null, 2));
        }
        } else {
        console.error(`Unknown error:`, error);
        }
}
}




// private async sendToModelAPI(accidentId: string, photoURLs: string[]) {
//         const modelApiUrl = 'https://3692-34-16-93-158.ngrok-free.app/process-images/';
    
//         try {
//             // Make sure photoURLs is a proper array of strings
//             const cleanURLs = Array.isArray(photoURLs) ? photoURLs : JSON.parse(photoURLs);
//             console.log("------------", cleanURLs);
//             const payload = {
//                 accidentId: accidentId,
//                 photoURLs: cleanURLs
//             };
    
//             const response = await this.httpService.post(modelApiUrl, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify(payload)
//             });
//         console.log(response);
    
//         } catch (error) {
//             console.error('Error sending to model API:', error);
         
//         }
//     }

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
