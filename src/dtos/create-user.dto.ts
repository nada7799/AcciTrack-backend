import { IsEmail, IsOptional, MaxLength, MinLength , Matches, ValidateIf, IsNotEmpty, IsString} from "class-validator";
import { firestore } from "firebase-admin";

export class CreateUserDto{
        @IsNotEmpty()
        @IsString()
        uid:string;

       
        @IsEmail()
        email? : string;

        @ValidateIf(o => !o.isGuest)
        @MinLength(2)
        @MaxLength(20)
        fullName?: string;



        isGuest: boolean = false; // Default value

        constructor(partial?: Partial<CreateUserDto>) {
        Object.assign(this, partial);
        if (this.isGuest === undefined) {
                this.isGuest = false;
        }
        }
}