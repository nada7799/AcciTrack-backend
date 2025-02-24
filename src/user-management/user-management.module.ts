import { Module } from '@nestjs/common';
import { UserManagementService } from './user-management.service';
import { UserManagementController } from './user-management.controller';
import { UserRepository } from './user-management.repository';
import { AuthenticationService } from 'src/authentication/authentication.service';

@Module({
  providers: [UserManagementService,UserRepository,AuthenticationService],
  controllers: [UserManagementController]
})
export class UserManagementModule {}
