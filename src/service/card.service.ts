import Card from '@entities/card.entity';
import CardRepository from '@repository/card.repository';
import UserService from '@service/user.service';
import { CLUSTER_CODE } from '../enum/cluster';
import { getRepo } from 'src/lib/util';
import logger from '../lib/logger';

export default class CardService {
	private static instance: CardService;

	static get service() {
		if (!CardService.instance) {
			CardService.instance = new CardService();
		}
		return CardService.instance;
	}

	async getAll(): Promise<Card[]> {
		try {
			logger.debug('getAllCard start');
			return await getRepo(CardRepository).find({ where: { using: false } });
		} catch (e) {
			logger.error(e);
			throw e;
		}
	}

	async createCard(adminId: number, start: string, end: string, type: string) {
		try {
			const cardRepo = getRepo(CardRepository);
			const _adminId = adminId;
			const _start = parseInt(start);
			const _end = parseInt(end);
			const _type = parseInt(type);

			logger.debug('createCard Start');
			logger.debug('_id, start, end, type', adminId, start, end, type);
			await UserService.service.checkIsAdmin(_adminId);
			for (let i = _start; i < _end; i++) {
				const card = new Card(_type);
				await cardRepo.save(card);
			}
		} catch (e) {
			logger.error(e);
			throw e;
		}
	}

	async validCheck(cardId: string) {
		try {
			logger.debug('ValidCheck Start');
			logger.debug('cardId : ', cardId);
			const cardRepo = getRepo(CardRepository);
			const card = await cardRepo.findOne(cardId);
			if (card) return { using: card.getStatus() };
			return { using: true };
		} catch (e) {
			logger.error(e);
			throw e;
		}
	}

	async getUsingInfo() {
		try {
			logger.debug('getUsingInfo start');
			const cardRepo = getRepo(CardRepository);
			const getCardStatus = (clusterType: CLUSTER_CODE) =>
				cardRepo.find({
					where: { using: true, type: clusterType }
				});
			const gaepo = (await getCardStatus(CLUSTER_CODE.gaepo)).length;
			const seocho = (await getCardStatus(CLUSTER_CODE.seocho)).length;
			return { gaepo, seocho };
		} catch (e) {
			logger.error(e);
			throw e;
		}
	}

	async getUsingCard(): Promise<Card[]> {
		try {
			logger.debug('getUsingCard Start');
			const card = await getRepo(CardRepository).find({ where: { using: true } });
			return card;
		} catch (e) {
			logger.error(e);
			throw e;
		}
	}

	async releaseCard(id: number): Promise<boolean> {
		try {
			logger.debug('releaseCard Start');
			const card = await getRepo(CardRepository).findOne(id);
			return getRepo(CardRepository).returnCard(card);
		} catch (e) {
			logger.error(e);
			throw e;
		}
	}
}
