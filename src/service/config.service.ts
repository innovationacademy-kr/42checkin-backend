import config from '@config/configuration';
import ConfigRepository from '@repository/config.repository';

import { getRepo } from 'src/lib/util';

export default class ConfigService {
	private static instance: ConfigService;

	constructor() {
	}

	static get service() {
		if (!ConfigService.instance) {
			ConfigService.instance = new ConfigService();
		}
		return ConfigService.instance;
	}

	async getConfig() {
		const configRepo = getRepo(ConfigRepository);
		return await configRepo.getConfig(config.env);
	}

	async setConfig(capacity: number) {
		const configRepo = getRepo(ConfigRepository);
		return await configRepo.setMaxCapacity(config.env, capacity);
	}
}
