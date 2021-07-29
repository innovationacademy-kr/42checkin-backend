import Card from '@entities/card.entity';
import Log from '@entities/log.entity';
import User from '@entities/user.entity';
import { LogRepository } from '@repository/log.repository';
import { getRepo } from 'src/lib/util';
import { CLUSTER_CODE } from '../enum/cluster';
import logger from '../lib/logger';

/**
 * 유저의 로그정보를 조회한다.
 */
const getUserLog = async (login: string, page: number): Promise<Log[]> => {
	try {
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
	} catch (e) {
		logger.error('error getUserLog', e);
		throw e;
	}
};

/**
 * 카드의 로그정보를 조회한다.
 */
const getCardLog = async (id: number, page: number): Promise<Log[]> => {
	try {
		logger.info('cardId: ', id);
		const logRepo = getRepo(LogRepository);
		return await logRepo.find({
			where: { card: { cardId: id } },
			order: { createdAt: 'DESC' },
			relations: [ 'user', 'card' ],
			skip: 50 * page,
			take: 50
		});
	} catch (e) {
		logger.error('error getCardLog', e);
		throw e;
	}
};

/**
 * 모든 로그정보를 조회한다.
 */
const getAll = async (): Promise<Log[]> => {
	try {
		const logRepo = getRepo(LogRepository);
		const logs = await logRepo.find({
			order: { createdAt: 'DESC' },
			relations: [ 'user', 'card' ],
			take: 1000
		});
		return logs;
	} catch (e) {
		logger.error('error getAll', e);
		throw e;
	}
};

/**
 * 로그정보를 생성한다.
 */
const createLog = async (user: User, card: Card, type: string): Promise<void> => {
	try {
		logger.info(`create log: { id: ${user.getId()}, cardId: ${card.getId()}, type: ${type} }`);
		const logRepo = getRepo(LogRepository);
		const log = new Log(user, card, type);
		await logRepo.save(log);
	} catch (e) {
		logger.error('error createLog', e);
		throw e;
	}
};

/**
 * 클러스터별 로그정보를 조회한다.
 */
const getCluster = async (type: CLUSTER_CODE, page: number): Promise<Log[]> => {
	try {
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
	} catch (e) {
		logger.error('error getCluster', e);
		throw e;
	}
};

/**
 * 특정 카드의 로그정보를 조회한다.
 */
const getCheckIn = async (type: number): Promise<Log[]> => {
	try {
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
	} catch (e) {
		logger.error('error getCheckIn', e);
		throw e;
	}
};

/**
 * 특정 클러스터의 로그정보를 조회한다.
 */
const getAllCard = async (type: number): Promise<Log[]> => {
	try {
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
	} catch (e) {
		logger.error('error getAllCard', e);
		throw e;
	}
};

export default {
	getUserLog,
	getCardLog,
	getAll,
	createLog,
	getCluster,
	getCheckIn,
	getAllCard
};
