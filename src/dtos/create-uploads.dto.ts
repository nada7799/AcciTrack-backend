import { ArrayMaxSize, ArrayMinSize, IsArray, IsNotEmpty, IsObject, IsString, MaxLength, MinLength, ValidateNested } from "class-validator";
import { LocationDto } from "./create-accident.dto";
import { Type } from "fireorm";

export class CreateUploadsDto{
        @IsString()
        @IsNotEmpty()
        userId : string;


        @IsNotEmpty()
        @IsObject()
        @ValidateNested()
        @Type(()=> LocationDto)
        location : {longitude: number , latitude : number};

        isGuestUpload : boolean;

        @IsNotEmpty()
        @IsArray()
        @IsString({each:true})
        @ArrayMinSize(3, {message: "At least 3 pictures muct be uploaded"})
        @ArrayMaxSize(7, {message: "No more than 7 pictures can be uploaded"})
        photoURLs : string[];
}