import { IsNotEmpty, IsNumber, IsObject,IsOptional,IsString,ValidateNested } from "class-validator";
export class UpdateActiveUsersDto{
    @IsNotEmpty()
    @IsNumber()
    latitude : number;

    @IsNotEmpty()
    @IsNumber()
    longitude: number;


    @IsString()
    @IsOptional() 
    fcmToken?:string;

    
}