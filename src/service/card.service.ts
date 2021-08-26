import httpStatus from 'http-status';
import * as userService from '@service/user.service';
import { IJwtUser } from '@strategy/jwt.strategy';
import ApiError from '@lib/errorHandle';
import DB from '@config/database';
import { CLUSTER_CODE } from '../enum/cluster';
import logger from '../lib/logger';

/**
 * 카드정보를 생성한다.
 */
export const createCard = async (user: IJwtUser, start: number, end: number, type: number) => {
	if (!start || !end) {
		throw new ApiError(httpStatus.BAD_REQUEST, '잘못된 요청입니다.');
	}
	if (!CLUSTER_CODE[type]) {
		throw new ApiError(httpStatus.BAD_REQUEST, '잘못된 요청입니다.');
	}
	if (!user) {
		throw new ApiError(httpStatus.UNAUTHORIZED, '권한이 없는 유저입니다.');
	}
	logger.info('create card option: ', { adminId: user._id, start, end, type });
	await userService.checkIsAdmin(user._id);
	const reqs = Array(end - start)
					.fill(type)
					.map(async (type) => (await DB.card.create({type})).save());
	return (await Promise.all(reqs)
				.then(_ => true)
				.catch(_ => false));
};

/**
 * 카드가 유효한지 확인한다.(사용여부)
 */
export const validCheck = async (cardId: string) => {
	logger.info('cardId: ', cardId);
	const card = await DB.card.findOne({ where: { cardId } })
	if (card === null) {
		throw new ApiError(httpStatus.NOT_FOUND, '존재하지 않는 카드번호입니다.');
	}
	return { using: card.using };
};

export const getCardStatus = async (clusterType: CLUSTER_CODE) => {
	return await DB.card.findAll({ where: { using: true, type: clusterType } });
};

/**
 * 두 클러스터의 사용중인 카드의 카운트를 가져온다
 */
export const getUsingInfo = async () => {
	const gaepo = (await getCardStatus(CLUSTER_CODE.gaepo)).length;
	const seocho = (await getCardStatus(CLUSTER_CODE.seocho)).length;
	logger.info(`using cnt info`, { gaepo, seocho });
	return { gaepo, seocho };
};

/**
 * 사용중인 카드들의 정보를 가져온다.
 */
export const getUsingCard = async () => {
	const card = await DB.card.findAll({ where: { using: true } });
	return card;
};

/**
 * 카드를 체크아웃시킨다.
 * 트랜잭션이 완전히 이루어지지 않아 생기는 테이블의 정합성을 위함
 */
export const releaseCard = async (id: number): Promise<boolean> => {
	logger.info(`${id} card will released`);
	return DB.card.update({ using: false }, { where: { cardId: id }})
		.then(_ => true)
		.catch(_ => false);
};
