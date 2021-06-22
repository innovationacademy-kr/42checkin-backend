import { EntityRepository, Repository } from 'typeorm';
import Card from '@entities/card.entity';

@EntityRepository(Card)
export default class CardRepository extends Repository<Card> {
	async useCard(id: number) {
		const card = await this.findOne(id);
		if (!card) throw "NotFoundException";
		if (card.getStatus()) throw "BardRequestException";
		const usingCard = await this.find({where: {using: true, type: card.getType()}});

		if (usingCard.length >= 150) throw "BardRequestException";
		card.useCard();
		await this.save(card);
		return card;
	}

	async returnCard(card: Card) {
		if (!card.getStatus()) throw new Error("BardRequestException");
		card.returnCard();
		await this.save(card);
		return true
	}
}
