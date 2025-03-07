import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ActiveUsersRepository } from './active-users.repository';
import { UpdateActiveUsersDto } from 'src/dtos/updateActiveUsers.dto';
import { CreateActiveUserDto } from 'src/dtos/createActiveUsers.dto';
import { firestore } from 'src/database/database.module';
import * as ngeohash from 'ngeohash';
import { UserRepository } from 'src/user-management/user-management.repository';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class ActiveUsersService {
        constructor(private readonly activeUserRepo:ActiveUsersRepository, private userRepo:UserRepository,
            private redis:RedisService ){}

        async createActiveUser(user:CreateActiveUserDto){
            const found = await this.activeUserRepo.getActiveUserById(user.id);
            if(found){
                console.log(found)
                throw new BadRequestException("user already exists");
            }
            const userMain = await this.userRepo.findUserById(user.id);
            if(!userMain){
                throw new NotFoundException("user not found in main database");
            }
            // cache active users who recently updated thier location
            // they saty in cahce for 10 minutes 
            await this.redis.geoAdd('active_users', user.longitude, user.latitude, user.fcmToken, 600);

            // save it in normal database
            const geohash = ngeohash.encode(user.latitude,user.longitude,8);
            const newUser = {
                ...user,
                location: {
                    geopoint:new firestore.GeoPoint(user.latitude, user.longitude),  
                    geohash,
                },
                lastUpdated: firestore.Timestamp.now()
            }
            return await this.activeUserRepo.create(newUser);
        }

        async updateActiveUser(id:string,updateActiveUser:UpdateActiveUsersDto){
            const user = await this.activeUserRepo.getActiveUserById(id);
            if(!user){
                throw new NotFoundException("user with this id is not found");
            }
            const geohash = ngeohash.encode(updateActiveUser.latitude,updateActiveUser.longitude,8);
            const newUser={
                ...user,
                ...updateActiveUser,
                location: {
                    geopoint:new firestore.GeoPoint(updateActiveUser.latitude, updateActiveUser.longitude),  
                    geohash, 
                },
                lastUpdated: firestore.Timestamp.now()
            }
            return await this.activeUserRepo.update(newUser);
        }
}
