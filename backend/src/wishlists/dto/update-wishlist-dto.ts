import { Wish } from 'src/wishes/entities/wishes.entity';

export class UpdateWishlistDto {
  name: string;
  image: string;
  itemsId: number[] | Wish[];
}
