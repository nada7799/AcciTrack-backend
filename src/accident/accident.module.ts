import { Module } from '@nestjs/common';
import { AccidentService } from './accident.service';
import { AccidentController } from './accident.controller';
import { AccidentRepository } from './accident.repository';

@Module({
  providers: [AccidentService,AccidentRepository],
  controllers: [AccidentController],
  exports:[AccidentService]
})
export class AccidentModule {}
