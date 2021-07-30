import Card from '@entities/card.entity';
import { EntityRepository, Repository } from 'typeorm';
import User from '@entities/user.entity';
import ApiError from '@lib/errorHandle';
import httpStatus from 'http-status';

// TODO nestjs흔적 지우기
@EntityRepository(User)
export default class UserRepository extends Repository<User> {
	async findWithCard(id: number): Promise<User> {
		const user = await this.findOne(id, { relations: [ 'card' ] });
		if (!user) throw new ApiError(httpStatus.NOT_FOUND, '해당 카드를 사용중인 유저가 존재하지 않습니다.');
		return user;
	}

	async getCard(id: number): Promise<Card> {
		const user = await this.findWithCard(id);
		const card = user.getCard();
		if (!card) throw new ApiError(httpStatus.NOT_FOUND, '사용중인 카드가 존재하지 않습니다.');
		return card;
	}

	async setCard(id: number, card: Card): Promise<User> {
		const user = await this.findWithCard(id);
		if (user.getCard()) throw new ApiError(httpStatus.NOT_FOUND, '사용중인 카드가 존재하지 않습니다.');
		user.cardSet(card);
		await this.save(user);
		return user;
	}

	async clearCard(id: number): Promise<User> {
		const user = await this.findWithCard(id);
		const card = user.getCard();
		if (!card) throw new ApiError(httpStatus.BAD_REQUEST, '이미 사용중인 카드입니다.');
		user.cardSet(null);
		await this.save(user);
		return user;
	}
}
