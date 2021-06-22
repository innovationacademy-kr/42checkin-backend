import Card from '@entities/card.entity';
import { EntityRepository, Repository } from 'typeorm';
import User from '@entities/user.entity';

// TODO nestjs흔적 지우기
@EntityRepository(User)
export default class UserRepository extends Repository<User> {

  async findWithCard(id: number): Promise<User> {
    const user = await this.findOne(id, { relations: ['card'] });
    if (!user) throw 'NotFoundException';
    return user;
  }

  async getCard(id: number): Promise<Card> {
    const user = await this.findWithCard(id);
    const card = user.getCard();
    if (!card) throw 'BadRequestException';
    return card;
  }

  async setCard(id: number, card: Card): Promise<User> {
    const user = await this.findWithCard(id);
    if (user.getCard()) throw  'BadRequestException';
    user.cardSet(card);
    await this.save(user);
    return user;
  }

  async clearCard(id: number): Promise<User> {
    const user = await this.findWithCard(id);
    const card = user.getCard();
    if (!card) throw 'BadRequestException';
    user.cardSet(null);
    await this.save(user);
    return user;
  }
}
