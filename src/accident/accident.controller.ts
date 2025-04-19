import { Body, Controller, Param, Post ,Header, HttpCode, NotFoundException} from '@nestjs/common';
import { AccidentInfoDto } from 'src/dtos/accidentInfo.dto';
import { AccidentRepository } from './accident.repository';
import { AccidentService } from './accident.service';
import { Res } from '@nestjs/common';
import { Response } from 'express';
import * as PDFDocument from 'pdfkit';
import * as fs from 'fs';

@Controller('accident')
export class AccidentController {

    constructor(private accidentRepo:AccidentRepository, private accidentService:AccidentService){}
    /* this controller is probably gonna be for statistics and extra features for accidents and also to send 
    the accident to the rest of the api */
    
    @Post(':id/add-result')
    @HttpCode(201)
    async addFinalInfo(
      @Param('id') id: string,
      @Body() accidentInfo: AccidentInfoDto,
    ) {
      const accidentFound = await this.accidentService.updateAccidentResults(id, accidentInfo);
      return {
        message: 'Accident result added successfully',
        data: accidentFound,
      };
    }


    @Post('update-results/:id')
  async updateResultsAndGeneratePDF(
    @Param('id') id: string,
    @Body() accidentInfo: AccidentInfoDto,
    @Res() res: Response
  ) {
    await this.accidentService.updateAccidentResults(id, accidentInfo);

    const filePath = path.resolve(`./reports/accident-${id}.pdf`);

    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('PDF report not found');
    }

    // 📥 Trigger PDF download
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=accident-${id}.pdf`,
    });

    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  }
    
}
