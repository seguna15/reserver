import { Injectable, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersRepository } from './user.repository';
import { TokenPayload } from '../interfaces/token-payload.interface';
import { GetUserDto } from './dto/get-user.dto';

@Injectable()
export class UsersService {
    constructor(private readonly usersRepository: UsersRepository) {}

    async create(createUserDTO: CreateUserDto) {
        await this.validateCreateUserDto(createUserDTO);
        return this.usersRepository.create({
            ...createUserDTO,
            password: await bcrypt.hash(createUserDTO.password, 10)
        });
    }

    private async validateCreateUserDto(createUserDto: CreateUserDto) {
        try {
            await this.usersRepository.findOne({ email: createUserDto.email });
        } catch (error) {
            return;
        }
        throw new UnprocessableEntityException('Email already exist.');
    }

    async getUser(getUserDto: GetUserDto){
        return await this.usersRepository.findOne(getUserDto);
    }

    async getUsers() {
        return await this.usersRepository.find({});
    }

    async deleteUser(_id: string) {
        return await this.usersRepository.findOneAndDelete({_id});
    }
    
    async verifyUser(email: string, password: string) {
        const user = await this.usersRepository.findOne({email});
        const passwordIsValid = await bcrypt.compare(password, user.password);

        if(!passwordIsValid) throw new UnauthorizedException('Credentials are not valid');

        return user;
    }
}
