import { IsEmail, IsOptional, MaxLength, MinLength , Matches, ValidateIf} from "class-validator";
import { firestore } from "firebase-admin";

export class CreateUserDto{
        @ValidateIf(o => !o.isGuest) // Only required if isGuest is false
        @IsEmail()
        email? : string;

        @ValidateIf(o => !o.isGuest)
        @MinLength(4)
        @MaxLength(20)
        @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {message: 'password too weak'})
        password?: string;

        @ValidateIf(o => !o.isGuest)
        @MinLength(2)
        @MaxLength(20)
        firstName?: string;

        @ValidateIf(o => !o.isGuest)
        @MinLength(2)
        @MaxLength(20)
        lastName?: string;

        isGuest: boolean = false; // Default value

        constructor(partial?: Partial<CreateUserDto>) {
        Object.assign(this, partial);
        if (this.isGuest === undefined) {
                this.isGuest = false;
        }
        }
}