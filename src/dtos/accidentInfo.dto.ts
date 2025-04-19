import { IsArray, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class AccidentInfoDto{
    @IsNotEmpty()
    @IsNumber()
    numberOfInjuries :number;

    @IsNotEmpty()
    @IsArray()
    @IsString({ each: true })
    woundCategory:string[];

    @IsNotEmpty()
    @IsString()
    bloodSeverity:string;

    @IsNotEmpty()
    @IsString()
    burnDegree:string;

    @IsNotEmpty()
    @IsArray()
    @IsString({ each: true })
    age:string[];

    @IsNotEmpty()
    @IsArray()
    @IsString({ each: true })
    gender:string[];

    @IsNotEmpty()
    @IsNumber()
    longitude:number;
    
    @IsNotEmpty()
    @IsNumber()
    latitude:number;
}