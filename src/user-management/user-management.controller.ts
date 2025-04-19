import { Body, Controller, Delete, Get, Headers, Param, Post, Put, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { CreateUserDto } from 'src/dtos/create-user.dto';
import { UserManagementService } from './user-management.service';
import { AuthenticationService } from 'src/authentication/authentication.service';
import { FirebaseAuthGuard } from 'src/authentication/firebase.gaurd';
import { UpdateUserDto } from 'src/dtos/updateUser.dto';

@Controller('user')
export class UserManagementController {
    constructor(private readonly userService:UserManagementService,
                private readonly authService:AuthenticationService
    ){}
    @Post("create-guest")
    async createUser(@Body('uid')uid:string){
        return await this.userService.createUser(uid);
    }
    // non guest
    @Post("sign-up")
    async signUp(@Body() createUser:CreateUserDto){
        return await this.userService.signUp(createUser);
    }

    // non guest and guest 
    // frontend takes care of the sign in process , and validates that the user is available in the 
    // firebase authentication and that his token is valid and returns the user data decoded from this token
    @Post("sign-in")
    async signIn(@Headers('Authorization')authHeader:string){
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new UnauthorizedException("Invalid Authorization Header");
        }
    
        const token = authHeader.split(" ")[1];
        return await this.userService.signIn(token);
    }
    
    @UseGuards(FirebaseAuthGuard)
    @Get('id/:id')
    async getUserById(@Param('id') id : string) {
        return await this.userService.getUserById(id);
    }

    @UseGuards(FirebaseAuthGuard)
    @Get('email/:email')
    async getUserByEmail(@Param('email') email : string) {
        return  await this.userService.getUserByEmail(email);
    }

    @UseGuards(FirebaseAuthGuard)
    @Get(':id/uploads')
    async getUserUploads(@Param('id') id : string ){
        return await this.userService.getUploadsOfUser(id);
    }

    @Post("upgrade-guest")
    async upgradeGuest(@Body()createUser:CreateUserDto){
                return await this.userService.upgradeGuest(createUser);
    }
    @UseGuards(FirebaseAuthGuard)
    @Delete(':id')
    async deleteUser(@Param('id')id:string){
        return await this.userService.deleteUser(id);
    }
    
    
    @UseGuards(FirebaseAuthGuard)
    @Post(':id/logout')
    async logout(@Param('id')id:string){
       return await this.userService.logout(id);
    }
    @UseGuards(FirebaseAuthGuard)
    @Put(':id/update')
    async editUserData(@Param('id')id:string,@Body()user:UpdateUserDto){
       return await this.userService.update(id,user);
    }

}
