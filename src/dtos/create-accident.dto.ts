import { IsArray, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, ValidateNested } from "class-validator";
import { Type } from "fireorm";

export class LocationDto{


    @IsNotEmpty()
    @IsNumber()
    longitude : number;


    @IsNotEmpty()
    @IsNumber()
    latitude : number;

    
}
export class CreateAccidentDto{

    @IsNotEmpty()
    @IsObject()
    @ValidateNested()
    @Type(()=> LocationDto)
    location : {longitude : number , latitude : number};



    @IsArray()
    @IsString({ each: true })
    uploadsId : string[]; 


    @IsArray()
    @IsString({ each: true })
    usersId: string[]


}