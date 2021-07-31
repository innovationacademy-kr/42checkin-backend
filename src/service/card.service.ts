import Card from '@entities/card.entity';
import CardRepository from '@repository/card.repository';
import userService from '@service/user.service';
import { CLUSTER_CODE } from '../enum/cluster';
import { getRepo } from 'src/lib/util';
import logger from '../lib/logger';
import { IJwtUser } from '../strategy/jwt.strategy';
import ApiError from '@lib/errorHandle';
import httpStatus from 'http-status';

/**
 * 현재 사용중인 모든 카드 정보를 가져온다.
 */
const getAll = async (): Promise<Card[]> => {
	return await getRepo(CardRepository).find({ where: { using: false } });
};

/**
 * 카드정보를 생성한다.
 */
const createCard = async (user: IJwtUser, start: number, end: number, type: number) => {
	if (!user) {
		throw new ApiError(httpStatus.UNAUTHORIZED, '권한이 없는 유저입니다.');
	}
	const cardRepo = getRepo(CardRepository);
	logger.info('create card option: ', { adminId: user._id, start, end, type });
	await userService.checkIsAdmin(user._id);
	for (let i = start; i < end; i++) {
		const card = new Card(type);
		await cardRepo.save(card);
	}
};

/**
 * 카드가 유효한지 확인한다.(사용여부)
 */
const validCheck = async (cardId: string) => {
	logger.info('cardId: ', cardId);
	const cardRepo = getRepo(CardRepository);
	const card = await cardRepo.findOne(cardId);
	return {
		using: card ? card.getStatus() : true
	};
};

const getCardStatus = async (clusterType: CLUSTER_CODE) => {
	const cardRepo = getRepo(CardRepository);
	return await cardRepo.find({ where: { using: true, type: clusterType } });
}

/**
 * 두 클러스터의 사용중인 카드의 카운트를 가져온다
 */
const getUsingInfo = async () => {
	const gaepo = (await getCardStatus(CLUSTER_CODE.gaepo)).length;
	const seocho = (await getCardStatus(CLUSTER_CODE.seocho)).length;
	logger.info(`using cnt info`, { gaepo, seocho });
	return { gaepo, seocho };
};

/**
 * 사용중인 카드들의 정보를 가져온다.
 */
const getUsingCard = async (): Promise<Card[]> => {
	const card = await getRepo(CardRepository).find({ where: { using: true } });
	return card;
};

/**
 * 카드를 체크아웃시킨다.
 * 트랜잭션이 완전히 이루어지지 않아 생기는 테이블의 정합성을 위함
 */
const releaseCard = async (id: number): Promise<boolean> => {
	const card = await getRepo(CardRepository).findOne(id);
	logger.info(`${id} card will released`);
	return getRepo(CardRepository).returnCard(card);
};

export default {
	getAll,
	createCard,
	validCheck,
	getUsingInfo,
	getUsingCard,
	releaseCard
};
