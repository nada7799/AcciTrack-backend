import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateActiveUserDto{
    @IsNotEmpty()
    @IsString()
    id:string;

    @IsNotEmpty()
    @IsNumber()
    latitude:number;

    @IsNotEmpty()
    @IsNumber()
    longitude:number;

    @IsNotEmpty()
    @IsString()
    fcmToken:string;
}