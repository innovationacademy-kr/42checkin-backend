import Card from '@entities/card.entity';
import CardRepository from '@repository/card.repository';
import userService from '@service/user.service';
import { CLUSTER_CODE } from '../enum/cluster';
import { getRepo } from 'src/lib/util';
import logger from '../lib/logger';

/**
 * 현재 사용중인 모든 카드 정보를 가져온다.
 */
const getAll = async (): Promise<Card[]> => {
	try {
		return await getRepo(CardRepository).find({ where: { using: false } });
	} catch (e) {
		logger.error('error getAllCard', e);
		throw e;
	}
};

/**
 * 카드정보를 생성한다.
 */
const createCard = async (adminId: number, start: string, end: string, type: string) => {
	try {
		const cardRepo = getRepo(CardRepository);
		const _adminId = adminId;
		const _start = parseInt(start);
		const _end = parseInt(end);
		const _type = parseInt(type);

		logger.info('create card option: ', { adminId, start, end, type });
		await userService.checkIsAdmin(_adminId);
		for (let i = _start; i < _end; i++) {
			const card = new Card(_type);
			await cardRepo.save(card);
		}
	} catch (e) {
		logger.error('error createCard', e);
		throw e;
	}
};

/**
 * 카드가 유효한지 확인한다.(사용여부)
 */
const validCheck = async (cardId: string) => {
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
};

/**
 * 두 클러스터의 사용중인 카드의 카운트를 가져온다
 */
const getUsingInfo = async () => {
	try {
		const cardRepo = getRepo(CardRepository);
		const getCardStatus = (clusterType: CLUSTER_CODE) =>
			cardRepo.find({ where: { using: true, type: clusterType } });
		const gaepo = (await getCardStatus(CLUSTER_CODE.gaepo)).length;
		const seocho = (await getCardStatus(CLUSTER_CODE.seocho)).length;
		logger.info(`using cnt info`, { gaepo, seocho });
		return { gaepo, seocho };
	} catch (e) {
		logger.error('error getUsingInfo', e);
		throw e;
	}
};

/**
 * 사용중인 카드들의 정보를 가져온다.
 */
const getUsingCard = async (): Promise<Card[]> => {
	try {
		const card = await getRepo(CardRepository).find({ where: { using: true } });
		return card;
	} catch (e) {
		logger.error('error getUsingCard', e);
		throw e;
	}
};

/**
 * 카드를 체크아웃시킨다.
 * 트랜잭션이 완전히 이루어지지 않아 생기는 테이블의 정합성을 위함
 */
const releaseCard = async (id: number): Promise<boolean> => {
	try {
		const card = await getRepo(CardRepository).findOne(id);
		logger.info(`${id} card will released`);
		return getRepo(CardRepository).returnCard(card);
	} catch (e) {
		logger.error('error releaseCard', e);
		throw e;
	}
};

export default {
	getAll,
	createCard,
	validCheck,
	getUsingInfo,
	getUsingCard,
	releaseCard
};
