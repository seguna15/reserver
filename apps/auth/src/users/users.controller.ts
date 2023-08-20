import { Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CurrentUser } from '../current-user.decorator';
import { UserDocument } from '@app/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService){}
    
    @Get()
    async getUsers(){
        return this.usersService.getUsers();
    } 

    @Get('/user')
    @UseGuards(JwtAuthGuard)
    async getUser(@CurrentUser() user: UserDocument){
        delete user.password;
       return user;
    }

    @Delete(':id')
    async deleteUsers(@Param('id') id: string){
        return this.usersService.deleteUser(id);
    }


}
