import Card from '@entities/card.entity';
import Log from '@entities/log.entity';
import User from '@entities/user.entity';
import { LogRepository } from '@repository/log.repository';
import { getRepo } from 'src/lib/util';
import { CLUSTER_CODE } from '../enum/cluster';
import logger from '../lib/logger';
import ApiError from '../lib/errorHandle';
import httpStatus from 'http-status';

/**
 * 유저의 로그정보를 조회한다.
 */
export const getUserLog = async (login: string, page: number): Promise<Log[]> => {
	logger.info('userName: ', login);
	const logRepo = getRepo(LogRepository);
	return await logRepo.find({
		relations: [ 'user', 'card' ],
		where: (qb: any) => {
			qb.where('Log__user.userName = :name', { name: login });
		},
		order: { createdAt: 'DESC' },
		skip: 50 * page,
		take: 50
	});
};

/**
 * 카드의 로그정보를 조회한다.
 */
export const getCardLog = async (id: number, page: number): Promise<Log[]> => {
	logger.info('cardId: ', id);
	const logRepo = getRepo(LogRepository);
	return await logRepo.find({
		where: { card: { cardId: id } },
		order: { createdAt: 'DESC' },
		relations: [ 'user', 'card' ],
		skip: 50 * page,
		take: 50
	});
};

/**
 * 모든 로그정보를 조회한다.
 */
export const getAll = async (): Promise<Log[]> => {
	const logRepo = getRepo(LogRepository);
	const logs = await logRepo.find({
		order: { createdAt: 'DESC' },
		relations: [ 'user', 'card' ],
		take: 1000
	});
	return logs;
};

/**
 * 로그정보를 생성한다.
 */
export const createLog = async (user: User, card: Card, type: string): Promise<void> => {
	logger.info(`create log: { id: ${user.getId()}, cardId: ${card.getId()}, type: ${type} }`);
	const logRepo = getRepo(LogRepository);
	const log = new Log(user, card, type);
	await logRepo.save(log);
};

/**
 * 클러스터별 로그정보를 조회한다.
 */
export const getCluster = async (type: CLUSTER_CODE, page: number): Promise<Log[]> => {
	if (!CLUSTER_CODE[type]) throw new ApiError(httpStatus.NOT_FOUND, '존재하지 않는 클러스터 코드입니다.');
	logger.info(`get ${CLUSTER_CODE[type]} cluster info (page: ${page})`);
	const logRepo = getRepo(LogRepository);
	return await logRepo.find({
		relations: [ 'user', 'card' ],
		where: (qb: any) => {
			qb.where('Log__card.type = :type', { type: type });
		},
		order: { createdAt: 'DESC' },
		skip: 50 * page,
		take: 50
	});
};

/**
 * 특정 카드의 로그정보를 조회한다.
 */
export const getCheckIn = async (type: number): Promise<Log[]> => {
	if (!CLUSTER_CODE[type]) throw new ApiError(httpStatus.NOT_FOUND, '존재하지 않는 클러스터 코드입니다.');
	logger.info(`getChekcin type: ${CLUSTER_CODE[type]}`);
	const logRepo = getRepo(LogRepository);
	return await logRepo.find({
		relations: [ 'user', 'card' ],
		where: (qb: any) => {
			qb
				.where('Log__card.type = :type', {
					type: type
				})
				.andWhere('Log__user.cardId = Log__card.cardId');
		},
		order: { createdAt: 'DESC' }
	});
};

/**
 * 특정 클러스터의 로그정보를 조회한다.
 */
export const getAllCard = async (type: number): Promise<Log[]> => {
	if (!CLUSTER_CODE[type]) throw new ApiError(httpStatus.NOT_FOUND, '존재하지 않는 클러스터 코드입니다.');
	logger.info(`getAllcard type: ${CLUSTER_CODE[type]}`);
	const logRepo = getRepo(LogRepository);
	return await logRepo.find({
		relations: [ 'user', 'card' ],
		where: (qb: any) => {
			qb
				.where('Log__card.type = :type', {
					type: type
				})
				.andWhere('Log__user.cardId = Log__card.cardId')
				// .andWhere('type = :type', { type: 'checkIn' })
				.orderBy('Log__card.cardId', 'DESC');
		}
	});
};
