import { Body, Controller, Param, Post } from '@nestjs/common';
import { ActiveUsersService } from './active-users.service';
import { ActiveUsersRepository } from './active-users.repository';
import { UpdateActiveUsersDto } from 'src/dtos/updateActiveUsers.dto';
import { CreateActiveUserDto } from 'src/dtos/createActiveUsers.dto';

@Controller('active-users')
export class ActiveUsersController {
    constructor(private activeUsersService:ActiveUsersService,private activeUsersRepo:ActiveUsersRepository){}
    @Post()
    async create(@Body()user:CreateActiveUserDto){
        return this.activeUsersService.createActiveUser(user);
    }

    @Post(':id/update')
    async updateActiveUser(@Param('id')id:string,@Body()user:UpdateActiveUsersDto){
        return this.activeUsersService.updateActiveUser(id,user);
    }
}
