import {
  Controller,
  UseGuards,
  Body,
  Req,
  Param,
  Post,
  Get,
} from '@nestjs/common';
import { JwtGuard } from 'src/auth/auth.guard';
import { CreateOfferDto } from './dto/create-offer-dto';
import { OffersService } from './offers.service';

@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @UseGuards(JwtGuard)
  @Post()
  create(@Body() dto: CreateOfferDto, @Req() req) {
    return this.offersService.create(dto, req.user);
  }

  @UseGuards(JwtGuard)
  @Get()
  getAll() {
    return this.offersService.findMany();
  }

  @Get(':id')
  getOne(@Param('id') id: number) {
    return this.offersService.findOne(id);
  }
}
