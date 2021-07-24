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
			return await getRepo(CardRepository).find({ where: { using: false } });
		} catch (e) {
			logger.error('error getAllCard', e);
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

			logger.info({ adminId, start, end, type });
			await UserService.service.checkIsAdmin(_adminId);
			for (let i = _start; i < _end; i++) {
				const card = new Card(_type);
				await cardRepo.save(card);
			}
		} catch (e) {
			logger.error('error createCard', e);
			throw e;
		}
	}

	async validCheck(cardId: string) {
		try {
			logger.info('cardId: ', cardId);
			const cardRepo = getRepo(CardRepository);
			const card = await cardRepo.findOne(cardId);
			if (card) return { using: card.getStatus() };
			return { using: true };
		} catch (e) {
			logger.error('error validCheck', e);
			throw e;
		}
	}

	async getUsingInfo() {
		try {
			const cardRepo = getRepo(CardRepository);
			const getCardStatus = (clusterType: CLUSTER_CODE) => cardRepo.find({ where: { using: true, type: clusterType } });
			const gaepo = (await getCardStatus(CLUSTER_CODE.gaepo)).length;
			const seocho = (await getCardStatus(CLUSTER_CODE.seocho)).length;
			logger.info(`gaepo_cnt: ${gaepo}, seocho_cnt: ${seocho}`);
			return { gaepo, seocho };
		} catch (e) {
			logger.error('error getUsingInfo', e);
			throw e;
		}
	}

	async getUsingCard(): Promise<Card[]> {
		try {
			const card = await getRepo(CardRepository).find({ where: { using: true } });
			return card;
		} catch (e) {
			logger.error('error getUsingCard', e);
			throw e;
		}
	}

	async releaseCard(id: number): Promise<boolean> {
		try {

			const card = await getRepo(CardRepository).findOne(id);
			logger.info(`${id} card will released`);
			return getRepo(CardRepository).returnCard(card);
		} catch (e) {
			logger.error('error releaseCard', e);
			throw e;
		}
	}
}
