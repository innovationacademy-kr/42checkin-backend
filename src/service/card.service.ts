import Card from '@entities/card.entity';
import CardRepository from '@repository/card.repository';
import UserService from '@service/user.service';
import { CLUSTER_CODE } from '../enum/cluster';
import { getRepo } from 'src/lib/util';

export class CardService {
	private static instance: CardService;

	constructor() {
	}

	static get service() {
		if (!CardService.instance) {
			CardService.instance = new CardService();
		}
		return CardService.instance;
	}

	async createCard(adminId: number, start: string, end: string, type: string) {
		try {
			const cardRepo = getRepo(CardRepository);
			const _adminId = adminId;
			const _start = parseInt(start);
			const _end = parseInt(end);
			const _type = parseInt(type);
			await UserService.service.checkIsAdmin(_adminId);
			for (let i = _start; i < _end; i++) {
				const card = new Card(_type);
				await cardRepo.save(card);
			}
		} catch (e) {
			console.log(e);
			throw e;
		}
	}

	async validCheck(cardId: string) {
		try {
			const cardRepo = getRepo(CardRepository);
			const card = await cardRepo.findOne(cardId);
			if (card) return { using: card.getStatus() };
			return { using: true };
		} catch (e) {
			throw e;
		}
	}

	async getUsingInfo() {
		try {
			const cardRepo = getRepo(CardRepository);
			const getCardStatus = (clusterType: CLUSTER_CODE) => cardRepo.find({
				where: { using: true, type: clusterType }
			})
			const gaepo = (await getCardStatus(CLUSTER_CODE.gaepo)).length;
			const seocho = (await getCardStatus(CLUSTER_CODE.seocho)).length;
			return { gaepo, seocho };
		} catch (e) {
			throw e;
		}
	}
}
