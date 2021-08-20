import config from '@config/configuration';
import ApiError from '@lib/errorHandle';
import ConfigRepository from '@repository/config.repository';
import httpStatus from 'http-status';

import { getRepo } from 'src/lib/util';

export const getConfig = async () => {
	const configRepo = getRepo(ConfigRepository);
	const setting = await configRepo.getConfig(config.env === 'devtest' ? 'development' : config.env);
	if (setting) {
		return setting;
	} else {
		throw new ApiError(httpStatus.NOT_FOUND, '해당 환경에 대한 설정값이 존재하지 않습니다.');
	}
}

export const setConfig = async (capacity: number) => {
	const configRepo = getRepo(ConfigRepository);
	const setting = await configRepo.setMaxCapacity(config.env === 'devtest' ? 'development' : config.env, capacity);
	if (setting) {
		return setting;
	} else {
		throw new ApiError(httpStatus.BAD_REQUEST, '설정값수정에 실패하였습니다.');
	}
}
