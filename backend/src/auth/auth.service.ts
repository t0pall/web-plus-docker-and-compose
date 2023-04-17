import { Injectable } from '@nestjs/common';
import { User } from '../users/entities/users.entity';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { BadRequestException } from '@nestjs/common/exceptions';
import * as bycrypt from 'bcrypt';
import { appErrors } from '../utils/app-errors';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async register(dto: CreateUserDto): Promise<CreateUserDto> {
    const existUserByName = await this.usersService.findOne(
      'username',
      dto?.username,
    );
    const existUserByEmail = await this.usersService.findOne(
      'email',
      dto?.email,
    );
    if (existUserByName || existUserByEmail) {
      throw new BadRequestException(appErrors.USER_EXIST);
    }
    return this.usersService.create(dto);
  }

  async login(username: string, password: string): Promise<User> {
    const existUser = await this.usersService.findOne('username', username);
    if (!existUser) throw new BadRequestException(appErrors.USER_NOT_FOUND);
    const validateUser = await bycrypt.compare(password, existUser.password);
    if (!validateUser) throw new BadRequestException(appErrors.WRONG_DATA);
    return existUser;
  }

  auth(userID: number) {
    const payload = { sub: userID };
    return { access_token: this.jwtService.sign(payload) };
  }
}
