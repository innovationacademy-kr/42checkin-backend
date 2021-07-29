import config from '@config/configuration';
import ConfigRepository from '@repository/config.repository';

import { getRepo } from 'src/lib/util';

const getConfig = async () => {
	const configRepo = getRepo(ConfigRepository);
	return await configRepo.getConfig(config.env);
}

const setConfig = async (capacity: number) => {
	const configRepo = getRepo(ConfigRepository);
	return await configRepo.setMaxCapacity(config.env, capacity);
}

export default {
	getConfig,
	setConfig
}