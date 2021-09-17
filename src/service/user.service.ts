import logger from '../modules/logger';
import { generateToken, IJwtUser } from '@modules/jwt.strategy';
import ApiError from '@modules/api.error';
import httpStatus from 'http-status';
import { Users } from '@models/users';
import { Op } from 'sequelize';
import { CLUSTER_CODE, CLUSTER_TYPE } from '@modules/cluster';
import { noticer } from '@modules/discord';
import * as logService from '@service/log.service';
import * as configService from '@service/config.service';
import { getTimeFormat, now } from '@modules/util';

/**
 * 미들웨어에서 넘어온 user정보로 JWT token 생성
 * */
export const login = async (user: Users): Promise<string> => {
    try {
        const existingUser = await Users.findOne({ where: { login: user.login } });

        //처음 사용하는 유저의 경우 db에 등록
        if (!existingUser) {
            await user.save();
            logger.info('new user save : ', user);
        } else if (existingUser.email !== user.email) {
            existingUser.email = user.email;
            await existingUser.save();
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
export const checkIsAdmin = async (id: number) => {
    logger.info(`checkIsAdmin user id: ${id}`);
    const user = await Users.findOne({ where: { _id: id } })
    if (user.type !== 'admin') {
        throw new ApiError(httpStatus.FORBIDDEN, '관리자 권한이 없는 사용자입니다.');
    }
    return true;
};

/**
 * 유저 및 카드 체크인 처리
 */
export const checkIn = async (userInfo: IJwtUser, cardId: string) => {
    if (!userInfo) {
        throw new ApiError(httpStatus.UNAUTHORIZED, '유저 정보 없음');
    }
    const userId = userInfo._id;
    const _cardId = parseInt(cardId);
    let notice = false;
    const cardOwner = await Users.findOne({ where: { card_no: cardId } });
    if (cardOwner) {
        logger.error('card is already using');
        throw new ApiError(httpStatus.CONFLICT, '이미 사용중인 카드입니다.');
    }
    const user = await Users.findOne({ where: { _id: userId } });
    const clusterType = user.getClusterType(_cardId)
    await user.setState('checkIn', user.login, _cardId).save();
    const { enterCnt, maxCnt } = await checkCanEnter(clusterType); //현재 이용자 수 확인

    // 남은 인원이 5명이하인 경우, 몇 명 남았는지 디스코드로 노티
    if (enterCnt + 1 >= maxCnt - 5) {
        noticer(CLUSTER_CODE[clusterType], maxCnt - enterCnt + 1);
        notice = true;
    }
    // 로그 생성
    logger.info(`checkIn user id: ${userId} cardId: ${cardId}`);
    await logService.createLog(user, 'checkIn');

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
    const id = userInfo._id;
    const user = await Users.findOne({ where: { _id: id } });
    logService.createLog(user, 'checkOut');
    const clusterType = user.getClusterType(user.card_no)
    await user.setState('checkOut', user.login).save();
    const { enterCnt, maxCnt } = await checkCanEnter(clusterType); //현재 이용자 수 확인

    // 남은 인원이 5명이하인 경우, 몇 명 남았는지 디스코드로 노티
    if (enterCnt - 1 >= maxCnt - 5) {
        noticer(CLUSTER_CODE[clusterType], maxCnt - enterCnt - 1);
    }
    logger.info({ action: 'checkOut', userId: id });
    return true;
};

/**
 * 유저 및 클러스터 상태 조회
 */
export const status = async (userInfo: IJwtUser) => {
    if (!userInfo) {
        throw new ApiError(httpStatus.UNAUTHORIZED, '유저 정보 없음');
    }
    const id = userInfo._id;
    const user = await Users.findOne({ where: { '_id': id } });
    if (!user) {
        logger.info({userInfo})
        throw new ApiError(httpStatus.UNAUTHORIZED, '유저 정보 없음');
    }
    let returnVal: any = {
        user: {
            login: user.login,
            card: user.card_no
        },
        cluster: await getUsingInfo(),
        isAdmin: user.type === 'admin'
    };

    logger.info(`user status id: ${id}`);
    logger.info('user status', returnVal);
    return returnVal;
};

/**
 * 강제 체크아웃
 */
export const forceCheckOut = async (adminInfo: IJwtUser, userId: string) => {
    if (!adminInfo) {
        throw new ApiError(httpStatus.UNAUTHORIZED, '유저 정보 없음');
    }
    await checkIsAdmin(adminInfo._id);
    const _userId = parseInt(userId);
    const user = await Users.findOne({ where: { _id: _userId } });
    if (!user) {
        throw new ApiError(httpStatus.UNAUTHORIZED, '유저 정보 없음');
    }
    if (user.card_no === null) {
        throw new ApiError(httpStatus.BAD_REQUEST, '이미 체크아웃된 유저입니다.');
    }
    const cardId = user.card_no;
    await logService.createLog(user, 'forceCheckOut');
    logger.info({ action: 'cardReturn', cardId });
    await user.setState('checkOut', adminInfo.name).save();
    return user;
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

const checkCanEnter = async (clusterType: CLUSTER_TYPE) => {
    const enterCnt = (await getUsingInfo())[clusterType];
    // 최대인원을 넘었으면 다 찼으면 체크인 불가
    const config = await configService.getConfig(getTimeFormat(new Date(), 'YYYY-MM-DD'));
    const maxCnt = config[clusterType];
    if (enterCnt >= maxCnt) {
        logger.error(`too many card cnt`, { enterCnt, max: maxCnt });
        throw new ApiError(httpStatus.CONFLICT, '수용할 수 있는 최대 인원을 초과했습니다.');
    }
    return {
        enterCnt, maxCnt
    }
}
