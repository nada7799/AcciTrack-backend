import { IsArray, IsString } from "class-validator";

export class UpdateAccidentDto{
    @IsArray()
    @IsString({ each: true })
    uploadsId : string[]; 

    @IsArray()
    @IsString({ each: true })
    usersId?: string[]
}