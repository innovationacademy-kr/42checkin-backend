import env from '@modules/env';
import ApiError from '@modules/api.error';
import httpStatus from 'http-status';
import { Config, Config as IConfig } from '@models/config';
import { Op } from 'sequelize';

/**
 *
 * @param date YYYY-MM-DD
 * @returns
 */
export const getConfig = async (date: string) => {
	const node_env = env.node_env === 'devtest' ? 'development' : env.node_env;
    const start_at = new Date(date);
    const end_at = new Date(date);

    start_at.setHours(0, 0, 0);
    end_at.setHours(23, 59, 59);
	const setting = await Config.findOne({
        where: {
            env: node_env,
            begin_at: {
                [Op.between]: [start_at, end_at]
            }
        } });
	if (setting) {
		return setting;
	} else {
		throw new ApiError(httpStatus.NOT_FOUND, '해당 환경에 대한 설정값이 존재하지 않습니다.');
	};
};

export const setConfig = async (body: { env: Partial<IConfig>, date: string }) => {
    const { env, date } = body;
    let setting = await getConfig(date);
	if (env.gaepo) setting.gaepo = env.gaepo;
    if (env.seocho) setting.seocho = env.seocho;
	if (env.begin_at) setting.begin_at = env.begin_at;
	if (env.end_at) setting.end_at = env.end_at;
	return setting.save()
		.then(_ => setting)
		.catch(_ => {
			throw new ApiError(httpStatus.BAD_REQUEST, '설정값수정에 실패하였습니다.');
		})
};
