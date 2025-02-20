import { Body, Controller, Post,Get, Param } from '@nestjs/common';
import { UploadsService } from './uploads.service';
import { CreateUploadsDto } from 'src/dtos/create-uploads.dto';

@Controller('uploads')
export class UploadsController {
    constructor(private uploadsService : UploadsService){}

    @Post()
    createUpload(@Body() createUpload:CreateUploadsDto){
        console.log(createUpload);
        const upload =  this.uploadsService.createUpload(createUpload);
        return upload;
    }

    @Get('\:id')
    getUploadById(@Param() id:string){
        return this.uploadsService.findUploadById(id);
    }

}
