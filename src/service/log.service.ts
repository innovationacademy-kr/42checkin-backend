import Card from '@entities/card.entity';
import Log from '@entities/log.entity';
import User from '@entities/user.entity';
import { LogRepository } from '@repository/log.repository';
import { getRepo } from 'src/lib/util';
import { CLUSTER_CODE } from '../enum/cluster';
import { MyLogger } from './logger.service';

export class LogService {
	private static instance: LogService;
	private logger: MyLogger;
	constructor() {
		this.logger = new MyLogger();
	}

	static get service() {
		if (!LogService.instance) {
			LogService.instance = new LogService();
		}
		return LogService.instance;
	}

	async getUserLog(login: string, page: number): Promise<Log[]> {
		try {
			this.logger.debug('getUserLog start');
      		this.logger.debug('userName : ', login);
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
			this.logger.error(e);
			throw e;
		}
	}

	async getCardLog(id: number, page: number): Promise<Log[]> {
		try {
			this.logger.debug('getCardLog start');
			this.logger.debug('cardId : ', id);
			const logRepo = getRepo(LogRepository);
			return await logRepo.find({
				where: { card: { cardId: id } },
				order: { createdAt: 'DESC' },
				relations: [ 'user', 'card' ],
				skip: 50 * page,
				take: 50
			});
		} catch (e) {
			this.logger.error(e);
			throw e;
		}
	}

	async getAll(): Promise<Log[]> {
		try {
			this.logger.debug('[ spreadsheet parser working... ] get all log');
			const logRepo = getRepo(LogRepository);
			const logs = await logRepo.find({
				order: { createdAt: 'DESC' },
				relations: [ 'user', 'card' ],
				take: 1000
			});
			return logs;
		} catch (e) {
			this.logger.error(e);
			throw e;
		}
	}

	async createLog(user: User, card: Card, type: string): Promise<void> {
		try {
			this.logger.debug('createLog start');
			this.logger.debug(
				'_id, cardId, type : ',
				user.getId(),
				card.getId(),
				type,
			);
			const logRepo = getRepo(LogRepository);
			const log = new Log(user, card, type);
			await logRepo.save(log);
		} catch (e) {
			this.logger.error(e);
			throw e;
		}
	}

	async getCluster(type: CLUSTER_CODE, page: number): Promise<Log[]> {
		try {
			this.logger.debug('getClusterLog start');
      		this.logger.debug('clusterType, page : ', type, page);
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
			this.logger.error(e);
			throw e;
		}
	}

	async getCheckIn(type: number): Promise<Log[]> {
		try {
			this.logger.debug('getCheckIn Start');
      		this.logger.debug('type : ', type);
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
			this.logger.error(e);
			throw e;
		}
	}

	async getAllCard(type: number): Promise<Log[]> {
		try {
			this.logger.debug('getAllCardLog Start');
      		this.logger.debug('type : ', type);
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
			this.logger.error(e);
			throw e;
		}
	}
}
