import {
  Controller,
  UseGuards,
  Post,
  Body,
  Req,
  Get,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { JwtGuard } from 'src/auth/auth.guard';
import { CreateWishlistDto } from './dto/create-wishlist-dto';
import { UpdateWishlistDto } from './dto/update-wishlist-dto';
import { WishlistsService } from './wishlists.service';

@Controller('wishlistlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Get()
  getAll() {
    return this.wishlistsService.findAll();
  }

  @UseGuards(JwtGuard)
  @Post()
  create(@Body() dto: CreateWishlistDto, @Req() req) {
    return this.wishlistsService.create(dto, req.user);
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  getOne(@Param('id') id: number) {
    return this.wishlistsService.findOne(id);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  update(@Body() dto: UpdateWishlistDto, @Param('id') id: number, @Req() req) {
    return this.wishlistsService.updateOne(id, dto, req.user);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  delete(@Param('id') id: number, @Req() req) {
    return this.wishlistsService.remove(id, req.user);
  }
}
