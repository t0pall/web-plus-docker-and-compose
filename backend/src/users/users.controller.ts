import { Controller, UseGuards, Req, Patch, Param } from '@nestjs/common';
import { Body, Get, Post } from '@nestjs/common/decorators';
import { JwtGuard } from 'src/auth/auth.guard';
import { WishesService } from 'src/wishes/wishes.service';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly wishesService: WishesService,
  ) {}

  @UseGuards(JwtGuard)
  @Get('me')
  async getMe(@Req() req) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = await this.usersService.findOne(
      'id',
      req.user.id,
    );
    return rest;
  }

  @UseGuards(JwtGuard)
  @Patch('me')
  update(@Req() req, @Body() body) {
    return this.usersService.updateOne(req.user, body);
  }

  @UseGuards(JwtGuard)
  @Get('me/wishes')
  async getMeWishes(@Req() req) {
    const users = await this.usersService.findUsersWithWishes(req.user.id);
    const wishes = users.map((user) => user.wishes);
    return wishes[0];
  }

  @UseGuards(JwtGuard)
  @Get(':username')
  getUser(@Param('username') username) {
    return this.usersService.findOne('username', username);
  }

  @UseGuards(JwtGuard)
  @Get(':username/wishes')
  getUsersWishes(@Param('username') username) {
    return this.wishesService.findMany('owner', { username });
  }

  @Post('find')
  findUsers(@Body('query') query: string) {
    return this.usersService.findMany(query);
  }
}
