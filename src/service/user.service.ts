import User from '@entities/user.entity';
import UserRepository from '@repository/user.repository';
import CardRepository from '@repository/card.repository';
import config from '@config/configuration';
import axios from 'axios';
import FormData from 'form-data';
import cardService from './card.service';
import { CLUSTER_CODE, CLUSTOM_TYPE } from 'src/enum/cluster';
import { getRepo } from 'src/lib/util';
import logService from './log.service';
import logger from '../lib/logger';
import configService from './config.service';
import { generateToken, IJwtUser } from '@strategy/jwt.strategy';
import ApiError from '@lib/errorHandle';
import httpStatus from 'http-status';

/**
 * UseGuards에서 넘어온 user로 JWT token 생성
 * */
const login = async (user: User): Promise<string> => {
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
		return await generateToken(existingUser ? existingUser : user);
	} catch (e) {
		logger.info('login fail', e);
		throw e;
	}
};

/**
 * 어드민 여부 확인
 */
const checkIsAdmin = async (adminId: number) => {
	logger.info(`checkIsAdmin user id: ${adminId}`);
	const userRepo = getRepo(UserRepository);
	const admin = await userRepo.findOne(adminId);
	if (!admin.getIsAdmin()) {
		throw new ApiError(httpStatus.FORBIDDEN, '관리자 권한이 없는 사용자입니다.');
	}
	return true;
};

/**
 * 디스코드 알림 발송
 */
const noticer = async (type: number, usingCard: number) => {
	const currentConfig = await configService.getConfig();
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
};

/**
 * 유저 및 카드 체크인 처리
 */
const checkIn = async (userInfo: IJwtUser, cardId: string) => {
	if (!userInfo) {
		throw new ApiError(httpStatus.UNAUTHORIZED, '유저 정보 없음');
	}
	const id = userInfo._id;
	logger.info(`checkIn user id: ${id} cardId: ${cardId}`);
	const cardRepo = getRepo(CardRepository);
	const userRepo = getRepo(UserRepository);

	//카드 유효성 확인
	const card = await cardRepo.findOne(parseInt(cardId));
	if (!card) {
		logger.error('card is not founded');
		throw new ApiError(httpStatus.NOT_FOUND, '존재하지 않는 카드번호입니다.');
	}
	if (card.getStatus()) {
		logger.error('card is already using');
		throw new ApiError(httpStatus.BAD_REQUEST, '이미 사용중인 카드입니다.');
	}

	//현재 이용자 수 확인
	const usingCardCnt = (await cardRepo.find({ where: { using: true, type: card.getType() } })).length;
	// 최대인원을 넘었으면 다 찼으면 체크인 불가
	const config = await configService.getConfig();
	const max = config.getMaxCapacity();
	if (usingCardCnt >= max) {
		logger.error(`too many card cnt`, { usingCardCnt, max });
		throw new ApiError(httpStatus.BAD_REQUEST, '수용할 수 있는 최대 인원을 초과했습니다.');
	}

	//모두 통과 후 카드 사용 프로세스
	card.useCard();
	await cardRepo.save(card);
	const user = await userRepo.setCard(id, card);

	// 몇 명 남았는지 디스코드로 노티
	noticer(card.getType(), usingCardCnt + 1);
	// 로그 생성
	await logService.createLog(user, card, 'checkIn');

	return true;
};

/**
 * 유저 및 카드 체크아웃 처리
 */
const checkOut = async (userInfo: IJwtUser) => {
	if (!userInfo) {
		throw new ApiError(httpStatus.UNAUTHORIZED, '유저 정보 없음');
	}
	const id = userInfo._id;
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
	noticer(type, usingCardCnt);
	await logService.createLog(user, card, 'checkOut');
	return true;
};

/**
 * 유저 및 클러스터 상태 조회
 */
const status = async (userInfo: IJwtUser) => {
	if (!userInfo) {
		throw new ApiError(httpStatus.UNAUTHORIZED, '유저 정보 없음');
	}
	const id = userInfo._id;
	let returnVal: any = {
		user: null,
		cluster: null,
		isAdmin: false
	};

	logger.info(`user status id: ${id}`);
	const userRepo = getRepo(UserRepository);
	const user = await userRepo.findWithCard(id);
	const info = {
		login: user.getName(),
		card: user.getCard() ? user.getCard().getId() : null,
	};
	const using = await cardService.getUsingInfo();

	returnVal.user = info;
	returnVal.isAdmin = user.getIsAdmin();
	returnVal.cluster = { gaepo: using.gaepo, seocho: using.seocho };
	logger.info(`user status : ${returnVal}`);
	return returnVal;
};

/**
 * 강제 체크아웃
 */
const forceCheckOut = async (adminInfo: IJwtUser, userId: string) => {
	if (!adminInfo) {
		throw new ApiError(httpStatus.UNAUTHORIZED, '유저 정보 없음');
	}
	const adminId = adminInfo._id;
	logger.info(`adminId: ${adminId}, userId: ${userId}`);
	const cardRepo = getRepo(CardRepository);
	const userRepo = getRepo(UserRepository);
	const _userId = parseInt(userId);
	await checkIsAdmin(adminId);
	const card = await userRepo.getCard(_userId);
	await cardRepo.returnCard(card);
	logger.info(`${card.getId()} card returned`);
	const user = await userRepo.clearCard(_userId);
	await logService.createLog(user, card, 'forceCheckOut');
	return user;
};

export default {
	login,
	checkIsAdmin,
	noticer,
	checkIn,
	checkOut,
	status,
	forceCheckOut
};
