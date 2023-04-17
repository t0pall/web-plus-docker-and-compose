import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/users.entity';
import { appErrors } from 'src/utils/app-errors';
import { FindOptionsOrder, Repository, In } from 'typeorm';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { Wish } from './entities/wishes.entity';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishesRepository: Repository<Wish>,
  ) {}

  async create(dto: CreateWishDto, owner: User) {
    return await this.wishesRepository.save({ ...dto, owner });
  }

  async findOne(id: number) {
    return await this.wishesRepository.findOne({
      relations: { owner: true, offers: { user: true } },
      where: { id },
    });
  }

  async findByOrder(order: FindOptionsOrder<Wish>, limit: number) {
    return await this.wishesRepository.find({
      relations: { owner: true },
      order: order,
      take: limit,
    });
  }

  async findMany(key: string, param: any) {
    return await this.wishesRepository.findBy({
      [key]: param,
    });
  }

  async findManyById(ids: number[]) {
    return await this.wishesRepository.findBy({
      id: In(ids),
    });
  }

  async update(id: number, dto: UpdateWishDto, userId: number) {
    const wish = await this.wishesRepository.findOne({
      relations: { owner: true, offers: true },
      where: { id },
    });
    if (dto.price && wish.raised > 0) {
      throw new ForbiddenException(
        'Вы не можете изменять стоимость подарка, если уже есть желающие скинуться',
      );
    }
    if (wish?.owner?.id !== userId || wish.offers.length) {
      throw new BadRequestException(appErrors.WRONG_DATA);
    }
    try {
      await this.wishesRepository.update(id, dto);
      return await this.wishesRepository.findBy({ id });
    } catch (_) {
      throw new InternalServerErrorException();
    }
  }

  async delete(id: number, userId: number) {
    const wish = await this.wishesRepository.findOne({
      relations: { owner: true, offers: true },
      where: { id },
    });
    if (wish?.owner?.id !== userId || wish.offers.length) {
      throw new BadRequestException(appErrors.WRONG_DATA);
    }
    return await this.wishesRepository.remove(wish);
  }

  async copy(id: number, user: User) {
    const wish = await this.wishesRepository.findOneBy({ id });
    const isAdded = (await this.wishesRepository.findOne({
      where: { owner: { id: user.id }, name: wish.name },
    }))
      ? true
      : false;
    if (isAdded) throw new ConflictException(appErrors.WRONG_DATA);
    wish.owner = user;
    delete wish.id;
    return await this.wishesRepository.save(wish);
  }
}
