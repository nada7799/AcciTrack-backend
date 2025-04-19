import { IsEmail, IsOptional, MaxLength, MinLength , Matches, ValidateIf, IsNotEmpty, IsString} from "class-validator";

export class DecodedUserDto{
    @IsString()
    @IsNotEmpty()
    uid:string;

    @IsEmail()
    @IsNotEmpty()
    email:string;

}