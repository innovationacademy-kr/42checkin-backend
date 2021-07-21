import Card from '@entities/card.entity';
import Log from '@entities/log.entity';
import User from '@entities/user.entity';
import { LogRepository } from '@repository/log.repository';
import { getRepo } from 'src/lib/util';
import { CLUSTER_CODE } from '../enum/cluster';
import logger from '../lib/logger';

export class LogService {
	private static instance: LogService;
	static get service() {
		if (!LogService.instance) {
			LogService.instance = new LogService();
		}
		return LogService.instance;
	}

	async getUserLog(login: string, page: number): Promise<Log[]> {
		try {
			logger.debug('getUserLog start');
      		logger.debug('userName : ', login);
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
			logger.error(e);
			throw e;
		}
	}

	async getCardLog(id: number, page: number): Promise<Log[]> {
		try {
			logger.debug('getCardLog start');
			logger.debug('cardId : ', id);
			const logRepo = getRepo(LogRepository);
			return await logRepo.find({
				where: { card: { cardId: id } },
				order: { createdAt: 'DESC' },
				relations: [ 'user', 'card' ],
				skip: 50 * page,
				take: 50
			});
		} catch (e) {
			logger.error(e);
			throw e;
		}
	}

	async getAll(): Promise<Log[]> {
		try {
			logger.debug('[ spreadsheet parser working... ] get all log');
			const logRepo = getRepo(LogRepository);
			const logs = await logRepo.find({
				order: { createdAt: 'DESC' },
				relations: [ 'user', 'card' ],
				take: 1000
			});
			return logs;
		} catch (e) {
			logger.error(e);
			throw e;
		}
	}

	async createLog(user: User, card: Card, type: string): Promise<void> {
		try {
			logger.debug('createLog start');
			logger.debug(
				'_id, cardId, type : ',
				user.getId(),
				card.getId(),
				type,
			);
			const logRepo = getRepo(LogRepository);
			const log = new Log(user, card, type);
			await logRepo.save(log);
		} catch (e) {
			logger.error(e);
			throw e;
		}
	}

	async getCluster(type: CLUSTER_CODE, page: number): Promise<Log[]> {
		try {
			logger.debug('getClusterLog start');
      		logger.debug('clusterType, page : ', type, page);
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
			logger.error(e);
			throw e;
		}
	}

	async getCheckIn(type: number): Promise<Log[]> {
		try {
			logger.debug('getCheckIn Start');
      		logger.debug('type : ', type);
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
			logger.error(e);
			throw e;
		}
	}

	async getAllCard(type: number): Promise<Log[]> {
		try {
			logger.debug('getAllCardLog Start');
      		logger.debug('type : ', type);
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
			logger.error(e);
			throw e;
		}
	}
}
