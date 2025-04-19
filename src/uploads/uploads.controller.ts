import { Body, Controller, Post,Get, Param, UseInterceptors, UploadedFiles, Req, BadRequestException } from '@nestjs/common';
import { UploadsService } from './uploads.service';
import { CreateUploadsDto } from 'src/dtos/create-uploads.dto';
import { Request } from 'express';
@Controller('uploads')
export class UploadsController {
    constructor(private uploadsService : UploadsService){}

    @Post()
async createUpload(@Req() req: Request) {
  //console.log("🟢 Received Body:", req.body);

  let parsedData;

  // Parse JSON if data is sent as a stringified object
  try {
    parsedData = typeof req.body.data === "string" ? JSON.parse(req.body.data) : req.body;
  } catch (error) {
    console.error("❌ Error parsing req.body.data:", error);
    throw new BadRequestException("Invalid request format");
  }

  //console.log("✅ Parsed Data:", parsedData);


  const createUploadDto: CreateUploadsDto = {
    userId: parsedData.userId,
    longitude: parseFloat(parsedData.location.longitude),
    latitude: parseFloat(parsedData.location.latitude),
    isGuestUpload: parsedData.isGuestUpload === true || parsedData.isGuestUpload === 'true',
  };

const photoURLs: string[] = parsedData.imageUrls;

return this.uploadsService.createUpload(createUploadDto, photoURLs);
}

    


    @Get(':id')
    getUploadById(@Param() id:string){
        return this.uploadsService.findUploadById(id);
    }

}
