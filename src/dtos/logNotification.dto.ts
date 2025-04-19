import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class LogNotificationDto{
    @IsNotEmpty()
    @IsString()
    userFCM : string;

    @IsNotEmpty()
    @IsString()
    message : string;

    @IsNotEmpty()
    @IsString()
    @IsNumber()
    latitude:number;

    @IsNotEmpty()
    @IsNumber()
    longitude:number;
    @IsOptional()
    @IsString()
    status?:string;
}