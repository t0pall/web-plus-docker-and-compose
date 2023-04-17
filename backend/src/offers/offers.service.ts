import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException } from '@nestjs/common/exceptions';
import { User } from 'src/users/entities/users.entity';
import { WishesService } from 'src/wishes/wishes.service';
import { Repository } from 'typeorm';
import { CreateOfferDto } from './dto/create-offer-dto';
import { Offer } from './entities/offers.entity';
import { appErrors } from 'src/utils/app-errors';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offerRepository: Repository<Offer>,
    private readonly wishesService: WishesService,
  ) {}

  async create(dto: CreateOfferDto, user: User) {
    const item = await this.wishesService.findOne(dto.itemId);
    if (+item.raised + dto.amount > item.price || item.owner.id === user.id) {
      throw new BadRequestException(appErrors.WRONG_DATA);
    }
    const { id } = await this.offerRepository.save({
      user,
      item,
      ...dto,
    });

    return await this.offerRepository.findBy({ id });
  }

  async findOne(id: number) {
    return await this.offerRepository.findBy({ id });
  }

  async findMany() {
    return await this.offerRepository.find();
  }
}
