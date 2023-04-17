import { Injectable } from '@nestjs/common';
import {
  BadRequestException,
  ConflictException,
} from '@nestjs/common/exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/users.entity';
import * as bycrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
import { appErrors } from 'src/utils/app-errors';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async hashPassword(password: string) {
    return bycrypt.hash(password, 10);
  }

  async create(dto: CreateUserDto) {
    dto.password = await this.hashPassword(dto?.password);
    const user = await this.usersRepository.save(dto);
    return user;
  }

  async findOne(key: string, param: any) {
    const user = await this.usersRepository.findOneBy({ [key]: param });
    return user;
  }

  async updateOne(user: User, dto: UpdateUserDto) {
    const { id } = user;
    const { email, username } = dto;
    if (dto.password) {
      dto.password = await this.hashPassword(dto.password);
    }
    const isExist = (await this.usersRepository.findOne({
      where: [{ email }, { username }],
    }))
      ? true
      : false;

    if (isExist) {
      throw new ConflictException(
        'Пользователь с таким email или username уже зарегистрирован',
      );
    }
    try {
      await this.usersRepository.update(id, dto);
      const { password, ...updUser } = await this.usersRepository.findOneBy({
        id,
      });
      return updUser;
    } catch (_) {
      throw new BadRequestException(appErrors.WRONG_DATA);
    }
  }

  async findMany(query: string) {
    const searchResult = await this.usersRepository.find({
      where: [{ email: Like(`%${query}%`) }, { username: Like(`%${query}%`) }],
    });
    return searchResult;
  }

  async findUsersWithWishes(id: number) {
    const users = await this.usersRepository.find({
      relations: { wishes: true },
      where: { id },
    });
    return users;
  }
}
