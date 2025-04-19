import { Module } from '@nestjs/common';
import { UploadsService } from './uploads.service';
import { UploadsController } from './uploads.controller';
import { AccidentService } from 'src/accident/accident.service';
import { UploadsRepository } from './uploads.repository';
import { RedisService } from 'src/redis/redis.service';
import { AccidentRepository } from 'src/accident/accident.repository';
import { UserRepository } from 'src/user-management/user-management.repository';
import { HttpService } from '@nestjs/axios';

@Module({
  providers: [UploadsService, AccidentService,UploadsRepository,RedisService,AccidentRepository,UserRepository],
  controllers: [UploadsController]
})
export class UploadsModule {}
