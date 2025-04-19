import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateUserDto{
        @IsOptional()
        @IsString()
        email ?: string;
    
        @IsOptional()
        @IsString()
        fullName?: string;
    
    
        @IsString()
        @IsOptional() 
        phoneNumber?:string;
}