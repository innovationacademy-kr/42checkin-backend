import config from '@config/configuration';
import DB from '@config/database';
import ApiError from '@lib/errorHandle';
import httpStatus from 'http-status';

export const getConfig = async () => {
	const env = config.env === 'devtest' ? 'development' : config.env;
	const setting = await DB.config.findOne({ where: { env } });
	if (setting) {
		return setting;
	} else {
		throw new ApiError(httpStatus.NOT_FOUND, '해당 환경에 대한 설정값이 존재하지 않습니다.');
	}
};

export const setConfig = async (capacity: number) => {
	const setting = await getConfig();
	setting.maxCapacity = capacity;
	return setting.save()
		.then(_ => setting)
		.catch(_ => {
			throw new ApiError(httpStatus.BAD_REQUEST, '설정값수정에 실패하였습니다.');
		})
};
