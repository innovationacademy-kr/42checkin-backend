import { CLUSTER_CODE } from '../enum/cluster';
import logger from '../lib/logger';
import ApiError from '../lib/errorHandle';
import httpStatus from 'http-status';
import DB from '@config/database';
import { Op } from 'sequelize';
import { CardModel } from 'src/model/card';
import { UserModel } from 'src/model/user';
import Sequelize from 'sequelize';

/**
 * 유저의 로그정보를 조회한다.
 */
export const getUserLog = async (login: string, page: number) => {
	logger.info('userName: ', login);
	return await DB.log.findAll({
		include: [
			{
				model: DB.card,
				as: 'card'
			},
			{
				model: DB.user,
				as: 'user',
				where: {
					userName: { [Op.eq]: login }
				}
			}
		],
		order: [ [ 'createdAt', 'DESC' ] ],
		offset: 50 * page,
		limit: 50
	});
};

/**
 * 카드의 로그정보를 조회한다.
 */
export const getCardLog = async (id: number, page: number) => {
	logger.info('cardId: ', id);
	return await DB.log.findAll({
		include: [
			{
				model: DB.card,
				as: 'card',
				where: {
					cardId: { [Op.eq]: id }
				}
			},
			{
				model: DB.user,
				as: 'user'
			}
		],
		order: [ [ 'createdAt', 'DESC' ] ],
		offset: 50 * page,
		limit: 50
	});
};

/**
 * 로그정보를 생성한다.
 */
export const createLog = async (user: UserModel, card: CardModel, type: string): Promise<void> => {
	logger.info(`create log: { id: ${user._id}, cardId: ${card.cardId}, type: ${type} }`);
	const log = await DB.log.create({ user_id: user._id, cardCardId: card.cardId, logType: type });
	await log.save();
};

/**
 * 클러스터별 로그정보를 조회한다.
 */
export const getCluster = async (type: CLUSTER_CODE, page: number) => {
	if (!CLUSTER_CODE[type]) throw new ApiError(httpStatus.NOT_FOUND, '존재하지 않는 클러스터 코드입니다.');
	logger.info(`get ${CLUSTER_CODE[type]} cluster info (page: ${page})`);
	return await DB.log.findAll({
		include: [
			{
				model: DB.card,
				as: 'card',
				where: {
					type: { [Op.eq]: type }
				}
			},
			{
				model: DB.user,
				as: 'user'
			}
		],
		order: [ [ 'createdAt', 'DESC' ] ],
		offset: 50 * page,
		limit: 50
	});
};

/**
 * 특정 카드의 로그정보를 조회한다.
 */
export const getCheckIn = async (type: number) => {
	if (!CLUSTER_CODE[type]) throw new ApiError(httpStatus.NOT_FOUND, '존재하지 않는 클러스터 코드입니다.');
	logger.info(`getChekcin type: ${CLUSTER_CODE[type]}`);
	return await DB.log.findAll({
		include: [ DB.log.associations.user, DB.log.associations.card ],
		where: {
			[Op.and]: [
				Sequelize.literal('`user`.`cardId` = `card`.`cardId`'),
				Sequelize.literal('`card`.`type` = ' + type)
			]
		},
		order: [ [ 'createdAt', 'DESC' ] ]
	});
};

/**
 * 특정 클러스터의 로그정보를 조회한다.
 */
export const getAllCard = async (type: number) => {
	if (!CLUSTER_CODE[type]) throw new ApiError(httpStatus.NOT_FOUND, '존재하지 않는 클러스터 코드입니다.');
	logger.info(`getAllcard type: ${CLUSTER_CODE[type]}`);

	return await DB.log.findAll({
		include: [ DB.log.associations.user, DB.log.associations.card ],
		where: {
			[Op.and]: [
				Sequelize.literal('`user`.`cardId` = `card`.`cardId`'),
				Sequelize.literal('`card`.`type` = ' + type)
			]
		},
		order: [ [ 'user', 'cardId', 'DESC' ] ]
	});
};
