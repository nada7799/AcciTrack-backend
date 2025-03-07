import { Body, Controller, Param, Post ,Header} from '@nestjs/common';
import { AccidentInfoDto } from 'src/dtos/accidentInfo.dto';
import { AccidentRepository } from './accident.repository';
import { AccidentService } from './accident.service';

@Controller('accident')
export class AccidentController {

    constructor(private accidentRepo:AccidentRepository, private accidentService:AccidentService){}
    /* this controller is probably gonna be for statistics and extra features for accidents and also to send 
    the accident to the rest of the api */
    
    @Post(':id/add-result')
    async addFinalInfo(@Param('id')id:string,@Body() accidentInfo:AccidentInfoDto){
        const accidentFound = await this.accidentService.updateAccidentResults(id,accidentInfo);
    }
}
