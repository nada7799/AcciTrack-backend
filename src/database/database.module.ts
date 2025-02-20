import { Global, Module } from '@nestjs/common';
import { firestore } from 'firebase-admin';

@Global()
@Module({
  providers: [{
   provide : 'FIRESTORE',
   useValue : firestore,
  },
],
exports : ['FIRESTORE'],
})
export class DatabaseModule {}
