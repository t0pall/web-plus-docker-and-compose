import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  Get,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { JwtGuard } from 'src/auth/auth.guard';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { WishesService } from './wishes.service';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @Post()
  @UseGuards(JwtGuard)
  create(@Body() dto: CreateWishDto, @Req() req) {
    return this.wishesService.create(dto, req?.user);
  }

  @Get('last')
  getLast() {
    return this.wishesService.findByOrder({ created_at: 'DESC' }, 40);
  }

  @Get('top')
  getTop() {
    return this.wishesService.findByOrder({ copied: 'DESC' }, 20);
  }

  @Get(':id')
  get(@Param('id') id: number) {
    return this.wishesService.findOne(id);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  update(@Param('id') id: number, @Body() dto: UpdateWishDto, @Req() req) {
    return this.wishesService.update(id, dto, req.user.id);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  delete(@Param('id') id: number, @Req() req) {
    return this.wishesService.delete(id, req.user.id);
  }

  @UseGuards(JwtGuard)
  @Post(':id/copy')
  copy(@Param('id') id: number, @Req() req) {
    return this.wishesService.copy(id, req.user);
  }
}
