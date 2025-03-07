import { Module } from '@nestjs/common';
import { ActiveUsersService } from './active-users.service';
import { ActiveUsersController } from './active-users.controller';
import { ActiveUsersRepository } from './active-users.repository';
import { UserRepository } from 'src/user-management/user-management.repository';
import { RedisService } from 'src/redis/redis.service';

@Module({
  providers: [ActiveUsersService,ActiveUsersRepository,UserRepository,RedisService],
  controllers: [ActiveUsersController]
})
export class ActiveUsersModule {}
