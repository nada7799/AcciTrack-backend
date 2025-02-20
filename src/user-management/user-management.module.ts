import { Module } from '@nestjs/common';
import { UserManagementService } from './user-management.service';
import { UserManagementController } from './user-management.controller';
import { UserRepository } from './user-management.repository';

@Module({
  providers: [UserManagementService,UserRepository],
  controllers: [UserManagementController]
})
export class UserManagementModule {}
