import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';
import { Accident } from 'src/accident/accident.entity';

@Injectable()
export class RedisService implements OnModuleInit,OnModuleDestroy{
    private redisClient:Redis;
    constructor(){
        this.redisClient = new Redis({
            host: process.env.REDIS_HOST || '127.0.0.1',
            port: Number(process.env.REDIS_PORT) || 6379,
        });
    }


    async set(key:string , value: string , ttl?:number){
        const val = JSON.stringify(value);
        if(ttl){
            await this.redisClient.set(key,val,'EX', ttl);
        }
        else{
            await this.redisClient.set(key,val);
        }
    }

    async get(key:string) {
        const found = await this.redisClient.get(key);
        if(found){
            return JSON.parse(found);
        }else{
            return null;
        }
        
    }
    async delete(key:string){
        await this.redisClient.del(key);
    }
    async flushAll(){
        await this.redisClient.flushall();
    }
    async geoAdd(key:string , lon:number , lat:number , value : string, ttl?:number){
        try{
            console.log("the longitude: ", lon);
            console.log("the latitude: ",lat)
            await this.redisClient.geoadd(key,lon,lat,value);
            if(ttl){
                await this.redisClient.expire(key,ttl);
            }
        }
        catch (error) {
        console.error('Redis geoAdd error:', error);
        throw new Error('Failed to add geospatial data to Redis');
        }
    }

    async geoSearch(key:string,ln:number,lat:number, radius: number=500):Promise<string|null>{
        const result = await this.redisClient.georadius(key,ln,lat,radius,'m', 'WITHDIST', 'COUNT', 1, 'ASC');
        return (result).length ? result[0][0] : null;
    }
    onModuleInit() {
        console.log('redis connected');
    }
    onModuleDestroy() {
        this.redisClient.quit();
    }
}
