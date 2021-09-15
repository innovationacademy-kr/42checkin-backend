import { CLUSTER_CODE } from '@modules/cluster';
import logger from '../modules/logger';
import ApiError from '@modules/api.error';
import httpStatus from 'http-status';
import { Op } from 'sequelize';
import { Users } from 'src/models/users';
import Sequelize from 'sequelize';
import { History } from '@models/history';

/**
 * 유저의 로그정보를 조회한다.
 */
export const getUserLog = async (login: string, page: number, listSize: number) => {
    // FIXME:
	logger.info('userName: ', login);
	const { rows, count } = await History.findAndCountAll({
        where: { login },
		order: [ [ 'createdAt', 'DESC' ] ],
		offset: listSize * (page - 1),
		limit: listSize
	});
	return { list: rows, lastPage: Math.ceil(count / listSize) };

	/*logger.info('userName: ', login);
	const { rows, count } = await DB.log.findAndCountAll({
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
		offset: listSize * (page - 1),
		limit: listSize
	});
	return { list: rows, lastPage: Math.ceil(count / listSize) };*/
};

/**
 * 카드의 로그정보를 조회한다.
 */
export const getCardLog = async (id: number, page: number, listSize: number) => {
    // FIXME:
	logger.info('cardId: ', id);
	const { rows, count } = await History.findAndCountAll({
        where: { card_no: id },
		order: [ [ 'createdAt', 'DESC' ] ],
		offset: listSize * (page - 1),
		limit: listSize
	});
	return { list: rows, lastPage: Math.ceil(count / listSize) };

	/*logger.info('cardId: ', id);
	const { rows, count } = await DB.log.findAndCountAll({
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
		offset: listSize * (page - 1),
		limit: listSize
	});
	return { list: rows, lastPage: Math.ceil(count / listSize) };*/
};

/**
 * 로그정보를 생성한다.
 */
export const createLog = async (user: Users, type: string): Promise<void> => {
    // FIXME:
	logger.info({ card_no: user.card_no, _id: user._id });
	const log = await History.create({
        login: user.login,
        card_no: user.card_no,
        type
    });
	await log.save();
	/*logger.info(`create log: { id: ${user._id}, cardId: ${card.cardId}, type: ${type} }`);
	const log = await DB.log.create({ user_id: user._id, cardCardId: card.cardId, logType: type });
	await log.save();*/
};

/**
 * 클러스터별 로그정보를 조회한다.
 */
export const getCluster = async (type: CLUSTER_CODE, page: number, listSize: number) => {
    // FIXME:
	if (!CLUSTER_CODE[type]) throw new ApiError(httpStatus.NOT_FOUND, '존재하지 않는 클러스터 코드입니다.');
	logger.info(`get ${CLUSTER_CODE[type]} cluster info (page: ${page})`);
    const option = type === CLUSTER_CODE.gaepo ? { [Op.lt]: 999 } : { [Op.gt]: 1000 }
	const { rows, count } = await History.findAndCountAll({
        where: {
            card_no: option
        },
		order: [ [ 'createdAt', 'DESC' ] ],
		offset: listSize * (page - 1),
		limit: listSize
	});
	return { list: rows, lastPage: Math.ceil(count / listSize) };
	/*if (!CLUSTER_CODE[type]) throw new ApiError(httpStatus.NOT_FOUND, '존재하지 않는 클러스터 코드입니다.');
	logger.info(`get ${CLUSTER_CODE[type]} cluster info (page: ${page})`);
	const { rows, count } = await DB.log.findAndCountAll({
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
		offset: listSize * (page - 1),
		limit: listSize
	});
	return { list: rows, lastPage: Math.ceil(count / listSize) };*/
};

/**
 * 특정 클러스터의 미반납카드를 조회한다.
 */
export const getCheckIn = async (clusterType: number, page: number, listSize: number) => {
    // FIXME:
	if (!CLUSTER_CODE[clusterType]) throw new ApiError(httpStatus.NOT_FOUND, '존재하지 않는 클러스터 코드입니다.');
	logger.info(`getChekcin type: ${CLUSTER_CODE[clusterType]}`);
    const clusterOption = clusterType === CLUSTER_CODE.gaepo ? { [Op.lt]: 999 } : { [Op.gt]: 1000 }
	const { rows, count } = await History.findAndCountAll({
        include: [Users],
		where: {
			[Op.and]: [
				Sequelize.literal('`users`.`card_no` = `history`.`card_no`'),
			],
            ...clusterOption,
		},
		order: [ [ 'createdAt', 'DESC' ] ],
		offset: listSize * (page - 1),
		limit: listSize
	});
	return { list: rows, lastPage: Math.ceil(count / listSize) };
	/*if (!CLUSTER_CODE[clusterType]) throw new ApiError(httpStatus.NOT_FOUND, '존재하지 않는 클러스터 코드입니다.');
	logger.info(`getChekcin type: ${CLUSTER_CODE[clusterType]}`);
	const { rows, count } = await DB.log.findAndCountAll({
		include: [ DB.log.associations.user, DB.log.associations.card ],
		where: {
			[Op.and]: [
				Sequelize.literal('`user`.`cardId` = `card`.`cardId`'),
				Sequelize.literal('`card`.`type` = ' + clusterType)
			]
		},
		order: [ [ 'createdAt', 'DESC' ] ],
		offset: listSize * (page - 1),
		limit: listSize
	});
	return { list: rows, lastPage: Math.ceil(count / listSize) };*/
};

/**
 * 특정 클러스터의 로그정보를 조회한다.
 */
export const getAllCard = async (clusterType: number, page: number, listSize: number) => {
    // FIXME:
	if (!CLUSTER_CODE[clusterType]) throw new ApiError(httpStatus.NOT_FOUND, '존재하지 않는 클러스터 코드입니다.');
	logger.info(`getAllcard type: ${CLUSTER_CODE[clusterType]}`);
    const clusterOption = clusterType === CLUSTER_CODE.gaepo ? { [Op.lt]: 999 } : { [Op.gt]: 1000 }
	const { rows, count } = await History.findAndCountAll({
		include: [ Users ],
		where: {
            [Op.and]: [
                Sequelize.literal('`users`.`card_no` = `history`.`card_no`'),
            ],
            ...clusterOption,
		},
		order: [ [ 'history', 'card_no', 'DESC' ] ],
		offset: listSize * (page - 1),
		limit: listSize
	});
	return { list: rows, lastPage: Math.ceil(count / listSize) };

	/*if (!CLUSTER_CODE[clusterType]) throw new ApiError(httpStatus.NOT_FOUND, '존재하지 않는 클러스터 코드입니다.');
	logger.info(`getAllcard type: ${CLUSTER_CODE[clusterType]}`);

	const { rows, count } = await DB.log.findAndCountAll({
		include: [ DB.log.associations.user, DB.log.associations.card ],
		where: {
			[Op.and]: [
				Sequelize.literal('`user`.`cardId` = `card`.`cardId`'),
				Sequelize.literal('`card`.`type` = ' + clusterType)
			]
		},
		order: [ [ 'user', 'cardId', 'DESC' ] ],
		offset: listSize * (page - 1),
		limit: listSize
	});
	return { list: rows, lastPage: Math.ceil(count / listSize) };*/
};
