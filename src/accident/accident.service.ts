import { Injectable, NotFoundException } from '@nestjs/common';
import { AccidentRepository } from './accident.repository';
import { CreateAccidentDto } from 'src/dtos/create-accident.dto';
import {UpdateAccidentDto} from 'src/dtos/update-accident.dto'
import * as geohash from 'ngeohash';
import { Timestamp } from '@google-cloud/firestore';
import { Accident } from './accident.entity';
import { firestore } from 'firebase-admin';
import { AccidentInfoDto } from 'src/dtos/accidentInfo.dto';
import * as PDFDocument from 'pdfkit';
import * as fs from 'fs';
@Injectable()
export class AccidentService {
    constructor(private accidentRepo : AccidentRepository){}
    // this is only called when there is an upload and we haven't found any matching accidents for it in the cache or the database
    async createAccident(createAccident:CreateAccidentDto){
        // get location for geohashing
       const {longitude , latitude} = createAccident.location;
       const location = createAccident.location;
       /* it creates a hash string of the latitude and longitude , and when we increase the percesion which is the
       third parameter passed , it represents more percise area that means a smaller areas
       the longer the hash , the smaller the area 
       8 -->  38 * 19 */
       const geohashVal = geohash.encode(latitude,longitude,8);
       // now for the bucket time approach
       const bucketSize = 5;
       const now = new Date();
       const time = Math.floor(now.getTime() / (bucketSize * 60 * 1000)) * (bucketSize* 60 * 1000);
       const timeBucket = Timestamp.fromDate(new Date(time));
       // create new accident
       const accident = {
        location : location,
            geohash: geohashVal,
            timeBucket : timeBucket,
            ...createAccident,
            createdAt : firestore.Timestamp.now(),
            updatedAt: firestore.Timestamp.now()
       }
      const returnedAccident = await this.accidentRepo.create(accident);
      return returnedAccident;

    }
        //this is called each time we find an upload that is close to an accident
    async updateAccident(id:string,updateAccidentDto: UpdateAccidentDto){
            const accident= await this.accidentRepo.findAccidentById(id);
            if(!accident){
                throw new NotFoundException("accident not found");
            }
            accident.uploadsId.push(...updateAccidentDto.uploadsId);
        const updatedAccident : Accident = {
                ...accident,
                updatedAt : firestore.Timestamp.now()
            }
            await this.accidentRepo.updateAccident(updatedAccident);
    }


    async updateAccidentResults(id:string, accidentInfo:AccidentInfoDto){

        const { latitude, longitude, ...accidentInfoWithoutLocation } = accidentInfo;
        console.log()
        const accidentFound = await this.accidentRepo.findAccidentById(id);
        if (!accidentFound) {
            throw new NotFoundException("accident not found");
        }
        
        const UpdatedAccident = {
            ...accidentFound,
            ...accidentInfoWithoutLocation,
            updatedAt: firestore.Timestamp.now()
        };
        
        await this.accidentRepo.updateAccident(UpdatedAccident);
        // 📄 Generate PDF
        const doc = new PDFDocument();
        const pdfPath = `./reports/accident-${id}.pdf`;

        
        const mapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;

        doc.pipe(fs.createWriteStream(pdfPath));

        doc.fontSize(20).text('Accident Report', { align: 'center', underline: true });
        doc.moveDown(2);

        // Bold field labels
        doc.fontSize(12).font('Helvetica-Bold').text(`Accident ID:`, { continued: true })
        .font('Helvetica').text(` ${id}`);
        doc.moveDown();


    
        doc.fillColor('blue').text('View on Map', {
        link: mapsLink,
        underline: true
        });

        doc.moveDown();

        doc.fillColor('black');
        doc.font('Helvetica-Bold').text(`Number of injuries:`, { continued: true })
        .font('Helvetica').text(` ${accidentInfo.numberOfInjuries}`);
        doc.moveDown();

        // Red text for critical info
        doc.font('Helvetica-Bold').text(`Blood severity:`, { continued: true });
        doc.fillColor('red').font('Helvetica').text(` ${accidentInfo.bloodSeverity}`);
        doc.fillColor('black').moveDown(); // Reset color

        doc.font('Helvetica-Bold').text(`Burn degree:`, { continued: true });
        doc.fillColor('red').font('Helvetica').text(` ${accidentInfo.burnDegree}`);
        doc.fillColor('black').moveDown();

        doc.font('Helvetica-Bold').text(`Detected wounds:`, { continued: true })
        .font('Helvetica').text(` ${accidentInfo.woundCategory.join(', ')}`);
        doc.moveDown();

        doc.font('Helvetica-Bold').text(`Age found:`, { continued: true })
        .font('Helvetica').text(` ${accidentInfo.age.join(', ')}`);
        doc.moveDown();

        doc.font('Helvetica-Bold').text(`Gender found:`, { continued: true })
        .font('Helvetica').text(` ${accidentInfo.gender.join(', ')}`);
        doc.moveDown();

        doc.moveDown();
        doc.fontSize(10).fillColor('gray').text(`Generated at: ${new Date().toLocaleString()}`, { align: 'right' });
        doc.end();
    }


    // function to search in the accidents collection for the nearst accident to this upload
    // if found it is returned , if not it returns null
    async findNearAccidents(geohashVal:string[], timeBucket:firestore.Timestamp){
            const accident = await this.accidentRepo.findByGeohashAndTime(geohashVal,timeBucket);
            return accident;
    }
    async deleteAccident(id:string){
        const accident = await this.accidentRepo.findAccidentById(id);
        if(accident){
            await this.accidentRepo.delete(id);
        }
    }

    async findAccidentById(id:string):Promise<Accident>{
        const accident = await this.accidentRepo.findAccidentById(id);
        if(!accident){
            throw new NotFoundException("accident not found by id");
        }
        return accident;
    }

}
