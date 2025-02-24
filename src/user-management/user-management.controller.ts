import { Body, Controller, Delete, Get, Headers, Param, Post, UseGuards } from '@nestjs/common';
import { CreateUserDto } from 'src/dtos/create-user.dto';
import { UserManagementService } from './user-management.service';
import { AuthenticationService } from 'src/authentication/authentication.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
export class UserManagementController {
    constructor(private readonly userService:UserManagementService,
                private readonly authService:AuthenticationService
    ){}
    @Post("create-guest/:id?")
    async createUser(@Param('id')id?:string){
        return await this.userService.createUser(id);
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
    async signIn(@Headers('Authorization')token:string){
        return await this.userService.signIn(token);
    }
    
    @UseGuards(AuthGuard('firebase'))
    @Get(':id')
    async getUserById(@Param('id') id : string) {
        return await this.userService.getUserById(id);
    }

    @UseGuards(AuthGuard('firebase'))
    @Get(':id/uploads')
    async getUserUploads(@Param('id') id : string ){
        return await this.userService.getUploadsOfUser(id);
    }

    @Post(":id/upgrade-guest")
    async upgradeGuest(@Param('id')id:string,@Body()createUser:CreateUserDto){
                return await this.userService.upgradeGuest(id,createUser);
    }

    @Delete(':id')
    async deleteUser(@Param('id')id:string){
        return await this.userService.deleteUser(id);
    }
    
    @Post('/:id/logout')
    @UseGuards(AuthGuard('firebase'))
    async logout(@Param('id')id:string){
       return await this.userService.logout(id);
    }
}
