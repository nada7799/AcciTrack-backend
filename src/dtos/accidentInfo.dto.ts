import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class AccidentInfoDto{
    @IsNotEmpty()
    @IsNumber()
    numberOfInjuries :number;

    @IsNotEmpty()
    @IsString()
    woundCategory:string;

    @IsNotEmpty()
    @IsString()
    bloodSeverity:string;

    @IsNotEmpty()
    @IsString()
    burnDegree:string;

    @IsNotEmpty()
    @IsString()
    age:string;

    @IsNotEmpty()
    @IsString()
    gender:string;
}