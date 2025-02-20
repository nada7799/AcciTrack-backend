import { Module } from '@nestjs/common';
import { UploadsService } from './uploads.service';
import { UploadsController } from './uploads.controller';
import { AccidentService } from 'src/accident/accident.service';
import { UploadsRepository } from './uploads.repository';
import { RedisService } from 'src/redis/redis.service';
import { AccidentRepository } from 'src/accident/accident.repository';

@Module({
  providers: [UploadsService, AccidentService,UploadsRepository,RedisService,AccidentRepository],
  controllers: [UploadsController]
})
export class UploadsModule {}
