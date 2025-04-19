import { Module } from '@nestjs/common';
import { UserManagementService } from './user-management.service';
import { UserManagementController } from './user-management.controller';
import { UserRepository } from './user-management.repository';
import { AuthenticationService } from 'src/authentication/authentication.service';
import { UploadsRepository } from 'src/uploads/uploads.repository';

@Module({
  providers: [UserManagementService,UserRepository,AuthenticationService,UploadsRepository],
  controllers: [UserManagementController]
})
export class UserManagementModule {}
