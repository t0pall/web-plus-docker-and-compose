import { Injectable } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common/exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/users.entity';
import { appErrors } from 'src/utils/app-errors';
import { WishesService } from 'src/wishes/wishes.service';
import { Repository } from 'typeorm';
import { CreateWishlistDto } from './dto/create-wishlist-dto';
import { UpdateWishlistDto } from './dto/update-wishlist-dto';
import { Wishlist } from './entities/wishlists.entity';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishlistsRepository: Repository<Wishlist>,
    private readonly wishesService: WishesService,
  ) {}

  async create(dto: CreateWishlistDto, owner: User) {
    const items = [];
    const { image, name } = dto;
    for (const itemId of dto.itemsId) {
      items.push(await this.wishesService.findOne(itemId));
    }
    return await this.wishlistsRepository.save({
      image,
      name,
      owner,
      items,
    });
  }

  async findAll() {
    return await this.wishlistsRepository.find({
      relations: { items: true },
    });
  }

  async findOne(id: number) {
    return await this.wishlistsRepository.findOne({
      relations: { items: true },
      where: { id },
    });
  }

  async updateOne(id: number, dto: UpdateWishlistDto, user: User) {
    const wishlist = await this.wishlistsRepository.findOne({
      where: { id },
      relations: { owner: true, items: true },
    });
    let items;
    if (dto.itemsId) {
      items = await this.wishesService.findManyById(dto.itemsId as number[]);
    }
    if (user.id !== wishlist?.owner?.id) {
      throw new BadRequestException(appErrors.WRONG_DATA);
    }
    await this.wishlistsRepository.save({
      id: wishlist.id,
      items: items ? items : wishlist.items,
      name: dto.name ? dto.name : wishlist?.name,
      image: dto.image ? dto.image : wishlist?.image,
      owner: wishlist.owner,
    });
    return await this.wishlistsRepository.findOne({
      where: { id },
      relations: { owner: true, items: true },
    });
  }

  async remove(id: number, user: User) {
    const wishlist = await this.wishlistsRepository.findOne({
      where: { id },
      relations: { owner: true },
    });
    if (user.id !== wishlist.owner.id) {
      throw new BadRequestException(appErrors.WRONG_DATA);
    }
    return await this.wishlistsRepository.remove(wishlist);
  }
}
