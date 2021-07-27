import User from '@entities/user.entity';
import AuthService from '@service/auth.service';
import UserRepository from '@repository/user.repository';
import CardRepository from '@repository/card.repository';
import config from '@config/configuration';
import axios from 'axios';
import FormData from 'form-data';
import { StatusDTO } from '@dto/status.dto';
import { ClusterDTO } from '@dto/cluster.dto';
import CardService from './card.service';
import { CLUSTER_CODE, CLUSTOM_TYPE } from 'src/enum/cluster';
import { getRepo } from 'src/lib/util';
import { LogService } from './log.service';
import logger from '../lib/logger';
import ConfigService from './config.service';

export default class UserService {
	authService: AuthService;
	private static instance: UserService;

	constructor() {
		this.authService = new AuthService();
	}

	static get service() {
		if (!UserService.instance) {
			UserService.instance = new UserService();
		}
		return UserService.instance;
	}

	/**
	 * UseGuards에서 넘어온 user로 JWT token 생성
	 * */
	async login(user: User): Promise<string> {
		try {
			const userRepo = getRepo(UserRepository);
			const existingUser = await userRepo.findOne({
				where: { userId: user.getUserId() }
			});

			//처음 사용하는 유저의 경우 db에 등록
			if (!existingUser) {
				await userRepo.save(user);
				logger.info('new user save : ', user);
			} else {
				existingUser.setEmail(user.getEmail());
				await userRepo.save(existingUser);
			}

			logger.info('Login user : ', existingUser);
			return await this.authService.generateToken(existingUser ? existingUser : user);
		} catch (e) {
			logger.info('login fail', e);
			throw e;
		}
	}

	async checkIsAdmin(adminId: number) {
		logger.info(`checkIsAdmin user id: ${adminId}`);
		const userRepo = getRepo(UserRepository);
		const admin = await userRepo.findOne(adminId);
		if (!admin.getIsAdmin()) {
			logger.error('user id not admin');
			throw 'ForbiddenException';
		}
		return true;
	}

	async checkIn(id: number, cardId: string) {
		try {
			logger.info(`checkIn user id: ${id} cardId: ${cardId}`);
			const cardRepo = getRepo(CardRepository);
			const userRepo = getRepo(UserRepository);

			//카드 유효성 확인
			const card = await cardRepo.findOne(parseInt(cardId));
			if (!card) {
				logger.error('card is not founded');
				throw 'NotFoundException';
			}
			if (card.getStatus()) {
				logger.error('card is already using');
				throw 'BadRequestException';
			}

			//현재 이용자 수 확인
			const usingCardCnt = (await cardRepo.find({ where: { using: true, type: card.getType() } })).length;
			// 최대인원을 넘었으면 다 찼으면 체크인 불가
			const config = await ConfigService.service.getConfig();
			const max = config.getMaxCapacity();
			if (usingCardCnt >= max) {
				logger.error(`too many card cnt`, { usingCardCnt, max });
				throw 'BadRequestException';
			}

			//모두 통과 후 카드 사용 프로세스
			card.useCard();
			await cardRepo.save(card);
			const user = await userRepo.setCard(id, card);

			// 몇 명 남았는지 디스코드로 노티
			this.noticer(card.getType(), usingCardCnt + 1);
			// 로그 생성
			await LogService.service.createLog(user, card, 'checkIn');

			return true;
		} catch (e) {
			logger.info('checkIn fail', e);
			return false;
		}
	}

	async checkOut(id: number) {
		try {
			logger.info(`user id: ${id}`);
			const cardRepo = getRepo(CardRepository);
			const userRepo = getRepo(UserRepository);
			const card = await userRepo.getCard(id);
			const type = card.getType();
			await cardRepo.returnCard(card);
			const user = await userRepo.clearCard(id);
			const usingCardCnt = (await cardRepo.find({ where: { using: true, type: type } })).length;
			logger.info(`usingCardCnt: ${usingCardCnt}`);

			//한자리 났다고 노티
			this.noticer(type, usingCardCnt);
			await LogService.service.createLog(user, card, 'checkOut');
			return true;
		} catch (e) {
			logger.error('checkOut fail', e);
			throw e;
		}
	}

	async noticer(type: number, usingCard: number) {
		const currentConfig = await ConfigService.service.getConfig();
		const maxCapacity = currentConfig.getMaxCapacity();
		if (usingCard >= maxCapacity - 5) {
			const form = new FormData();
			form.append('content', `${maxCapacity - usingCard}명 남았습니다`);
			if (type === 1 || type === 0) {
				const { id, pw } = config.discord[CLUSTER_CODE[type] as CLUSTOM_TYPE];
				axios
					.post(`https://discord.com/api/webhooks/${id}/${pw}`, { form }, { ...form.getHeaders() })
					.then((res) => {
						logger.info('discord notice success', res);
					})
					.catch((e) => {
						logger.error('discord notice fail', e);
					});
			}
		}
	}

	async status(id: number) {
		try {
			let returnVal: any = {
				user: null,
				cluster: null,
				isAdmin: false
			};

			logger.info(`user status id: ${id}`);
			const userRepo = getRepo(UserRepository);
			const user = await userRepo.findWithCard(id);
			const userInfo = new StatusDTO(user, null);
			const using = await CardService.service.getUsingInfo();
			const cluster = new ClusterDTO(using.gaepo, using.seocho, null, null);

			returnVal.user = userInfo;
			returnVal.isAdmin = user.getIsAdmin();
			returnVal.cluster = cluster;
			logger.info(`user status : ${returnVal}`);
			return returnVal;
		} catch (e) {
			logger.info('status fail', e);
			throw e;
		}
	}

	async forceCheckOut(adminId: number, userId: string) {
		try {
			logger.info(`adminId: ${adminId}, userId: ${userId}`);
			const cardRepo = getRepo(CardRepository);
			const userRepo = getRepo(UserRepository);
			const _userId = parseInt(userId);
			await this.checkIsAdmin(adminId);
			const card = await userRepo.getCard(_userId);
			await cardRepo.returnCard(card);
			logger.info(`${card.getId()} card returned`);
			const user = await userRepo.clearCard(_userId);
			await LogService.service.createLog(user, card, 'forceCheckOut');
			return user;
		} catch (e) {
			logger.info('forceCheckOut fail', e);
			throw e;
		}
	}
}
