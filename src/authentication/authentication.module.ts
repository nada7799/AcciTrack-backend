import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { PassportModule } from '@nestjs/passport';
import { FirebaseAuthStrategy } from './firebase.strategy';

@Module({
  imports: [PassportModule.register({defaultStrategy: 'firebase'})],
  providers: [AuthenticationService,FirebaseAuthStrategy],
  exports: [AuthenticationService]
})
export class AuthenticationModule {}
