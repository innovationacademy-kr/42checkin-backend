import { EntityRepository, Repository } from 'typeorm';
import Card from '@entities/card.entity';
import ApiError from '../lib/errorHandle';
import httpStatus from 'http-status';

@EntityRepository(Card)
export default class CardRepository extends Repository<Card> {
	async useCard(id: number) {
		const card = await this.findOne(id);
		if (!card) throw new ApiError(httpStatus.NOT_FOUND, '카드정보를 찾을 수 없습니다.');
		if (card.getStatus()) throw new ApiError(httpStatus.BAD_REQUEST, '이미 사용중인 카드입니다.');
		card.useCard();
		await this.save(card);
		return card;
	}

	async returnCard(card: Card) {
		if (!card) throw new ApiError(httpStatus.NOT_FOUND, '카드정보를 찾을 수 없습니다.');
		if (!card.getStatus()) throw new ApiError(httpStatus.BAD_REQUEST, '이미 카드가 회수된 상태입니다.');
		card.returnCard();
		await this.save(card);
		return true;
	}
}
