import logger from '../modules/logger';
import { generateToken, IJwtUser } from '@modules/jwt.strategy';
import ApiError from '@modules/api.error';
import httpStatus from 'http-status';
import { Users } from '@models/users';
import { Op } from 'sequelize';
import { CLUSTER_CODE } from '../modules/cluster';
import { noticer } from '@modules/discord';
import * as logService from '@service/log.service';
import * as configService from '@service/config.service';
import { getTimeFormat } from '@modules/util';

/**
 * UseGuards에서 넘어온 user로 JWT token 생성
 * */
export const login = async (user: Users): Promise<string> => {
	try {
        // FIXME:
		const existingUser = await Users.findOne({where: { login: user.login }});

		//처음 사용하는 유저의 경우 db에 등록
		if (!existingUser) {
			await user.save();
			logger.info('new user save : ', user);
		} else if (existingUser.email !== user.email){
			existingUser.email = user.email;
			await existingUser.save();
		}
		/*const existingUser = await user.findOne({where: { userId: user.userId }});

		//처음 사용하는 유저의 경우 db에 등록
		if (!existingUser) {
			await user.save();
			logger.info('new user save : ', user);
		} else if (existingUser.email !== user.email){
			existingUser.email = user.email;
			await existingUser.save();
		}
        */
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
export const checkIsAdmin = async (id: number) => {
	logger.info(`checkIsAdmin user id: ${id}`);
    const admin = await Users.findOne({ where: { _id: id }})
    if ((admin.type === 'admin')) {
        throw new ApiError(httpStatus.FORBIDDEN, '관리자 권한이 없는 사용자입니다.');
    }
    // FIXME:
	/*const admin = await DB.user.findOne({ where: { _id: adminId } });
	if (!admin.isAdmin) {
		throw new ApiError(httpStatus.FORBIDDEN, '관리자 권한이 없는 사용자입니다.');
	}*/
	return true;
};

/**
 * 유저 및 카드 체크인 처리
 */
export const checkIn = async (userInfo: IJwtUser, cardId: string) => {
	if (!userInfo) {
		throw new ApiError(httpStatus.UNAUTHORIZED, '유저 정보 없음');
	}
    // FIXME:

	const id = userInfo._id;
    const _cardId = parseInt(cardId);
	logger.info(`checkIn user id: ${id} cardId: ${cardId}`);
	let notice = false;

	//카드 유효성 확인
    const user = await Users.findOne({ where: { _id: id } });
    const clusterType = user.getClusterType(_cardId)
    if (user) {
		logger.error('card is already using');
		throw new ApiError(httpStatus.CONFLICT, '이미 사용중인 카드입니다.');
	}

	//현재 이용자 수 확인
    const usingCardCnt = (await getUsingInfo())[clusterType];
	// 최대인원을 넘었으면 다 찼으면 체크인 불가
    const config = await configService.getConfig(getTimeFormat(new Date(), 'YYYY-MM-DD'));
    const maxCapacity = config[clusterType];
    if (usingCardCnt >= maxCapacity) {
		logger.error(`too many card cnt`, { usingCardCnt, max: maxCapacity });
		throw new ApiError(httpStatus.CONFLICT, '수용할 수 있는 최대 인원을 초과했습니다.');
	}

	//모두 통과 후 카드 사용 프로세스
	user.card_no = _cardId
	await user.save();
	// const user = await DB.user.prototype.setCard(id, card);

	// 몇 명 남았는지 디스코드로 노티
	if (usingCardCnt + 1 >= maxCapacity - 5) {
        noticer(CLUSTER_CODE[clusterType], maxCapacity - usingCardCnt + 1);
		notice = true;
	}
	// 로그 생성
	await logService.createLog(user, 'checkIn');

	/*const id = userInfo._id;
	logger.info(`checkIn user id: ${id} cardId: ${cardId}`);
	let notice = false;

	//카드 유효성 확인
	const card = await DB.card.findOne({ where: { cardId } })

	if (!card) {
		logger.error('card is not founded');
		throw new ApiError(httpStatus.CONFLICT, '존재하지 않는 카드번호입니다.');
	}
	if (card.using) {
		logger.error('card is already using');
		throw new ApiError(httpStatus.CONFLICT, '이미 사용중인 카드입니다.');
	}

	//현재 이용자 수 확인
	const usingCardCnt = (await DB.card.findAll({ where: { using: true, type: card.type } })).length;
	// 최대인원을 넘었으면 다 찼으면 체크인 불가
	const config = await configService.getConfig();
	const maxCapacity = card.type === CLUSTER_CODE.gaepo ? config.maxCapGaepo : config.maxCapSeocho;
	if (usingCardCnt >= maxCapacity) {
		logger.error(`too many card cnt`, { usingCardCnt, max: maxCapacity });
		throw new ApiError(httpStatus.CONFLICT, '수용할 수 있는 최대 인원을 초과했습니다.');
	}

	//모두 통과 후 카드 사용 프로세스
	card.using = true;
	await card.save();
	const user = await DB.user.prototype.setCard(id, card);

	// 몇 명 남았는지 디스코드로 노티
	if (usingCardCnt + 1 >= maxCapacity - 5) {
		noticer(card.type, maxCapacity - usingCardCnt + 1);
		notice = true;
	}
	// 로그 생성
	await logService.createLog(user, card, 'checkIn');*/

	return {
		result: true,
		notice
	};
};

/**
 * 유저 및 카드 체크아웃 처리
 */
export const checkOut = async (userInfo: IJwtUser) => {
	if (!userInfo) {
		throw new ApiError(httpStatus.UNAUTHORIZED, '유저 정보 없음');
	}

    // FIXME:
	const id = userInfo._id;
	logger.info(`user id: ${id}`);
    const user = await Users.findOne({where: {_id: id}});
    const clusterType = user.card_no > 999 ? CLUSTER_CODE.seocho : CLUSTER_CODE.gaepo;
	await logService.createLog(user, 'checkOut');
	user.card_no = null;
	await user.save();
    const usingInfo = await getUsingInfo();
    const usingCardCnt = usingInfo[CLUSTER_CODE[clusterType]];
	logger.info(`usingCardCnt: ${usingCardCnt}`);

	//한자리 났다고 노티
    noticer(clusterType, usingCardCnt);

	/*const id = userInfo._id;
	logger.info(`user id: ${id}`);
	const card = await DB.user.prototype.getCard(id);
	const type = card.type;
	card.using = false;
	await card.save();
	const user = await DB.user.prototype.clearCard(id);
	const usingCardCnt = (await DB.card.findAll({ where: { using: true, type: type } })).length;
	logger.info(`usingCardCnt: ${usingCardCnt}`);

	//한자리 났다고 노티
	noticer(type, usingCardCnt);
	await logService.createLog(user, card, 'checkOut');*/
	return true;
};

/**
 * 유저 및 클러스터 상태 조회
 */
export const status = async (userInfo: IJwtUser) => {
	if (!userInfo) {
		throw new ApiError(httpStatus.UNAUTHORIZED, '유저 정보 없음');
	}
    // FIXME:
	const id = userInfo._id;
	let returnVal: any = {
        user: null,
		cluster: null,
		isAdmin: false
	};
    logger.info(`user status id: ${id}`);
	const user = await Users.findOne({ where: { '_id': id } });

	returnVal.user = {
		login: user.login,
        card: user.card_no
	};
	returnVal.isAdmin = user.type === 'admin';
    returnVal.cluster = await getUsingInfo();

	logger.info('user status', returnVal);
	return returnVal;
	/*const id = userInfo._id;
	let returnVal: any = {
		user: null,
		cluster: null,
		isAdmin: false
	};

	logger.info(`user status id: ${id}`);
	const user = await DB.user.findOne({ where: { '_id': id }, include: [DB.user.associations.card] });
	const using = await cardService.getUsingInfo();

	returnVal.user = {
		login: user.userName,
		card: user.card?.cardId || null
	};
	returnVal.isAdmin = user.isAdmin;
	returnVal.cluster = { gaepo: using.gaepo, seocho: using.seocho };
	logger.info('user status', returnVal);
	return returnVal;*/
    return {};
};

/**
 * 강제 체크아웃
 */
export const forceCheckOut = async (adminInfo: IJwtUser, userId: string) => {
	if (!adminInfo) {
		throw new ApiError(httpStatus.UNAUTHORIZED, '유저 정보 없음');
	}
    // FIXME: 이제 필요없음. 새로운 함수 필요
	/*const adminId = adminInfo._id;
	logger.info(`adminId: ${adminId}, userId: ${userId}`);
	const _userId = parseInt(userId);
	await checkIsAdmin(adminId);
	const card = await DB.user.prototype.getCard(_userId);
	card.using = false;
	await card.save();
	logger.info(`${card.cardId} card returned`);
	const user = await DB.user.prototype.clearCard(_userId);
	await logService.createLog(user, card, 'forceCheckOut');
	return user;*/

    return {};
};

/**
 * 두 클러스터의 사용중인 카드의 카운트를 가져온다
 */
export const getUsingInfo = async () => {
    const gaepo = await Users.count({
        where: {
            card_no: {
                [Op.lt]: 999
            }
        }
    })
    const seocho = await Users.count({
        where: {
            card_no: {
                [Op.gt]: 1000
            }
        }
    })
    return {
        [CLUSTER_CODE[0]]: gaepo,
        [CLUSTER_CODE[1]]: seocho
    };
}