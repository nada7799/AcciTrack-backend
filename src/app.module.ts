import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AccidentModule } from './accident/accident.module';
import { NotificationsModule } from './notifications/notifications.module';
import { UserManagementModule } from './user-management/user-management.module';
import { DatabaseModule } from './database/database.module';
import { UploadsModule } from './uploads/uploads.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { RedisModule } from './redis/redis.module';



@Module({
  imports: [ AccidentModule, NotificationsModule, UserManagementModule, DatabaseModule, UploadsModule, AuthenticationModule, RedisModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
