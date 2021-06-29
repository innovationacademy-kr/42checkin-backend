import { EntityRepository, Repository } from 'typeorm';
import Config from '@entities/Config.entity';

@EntityRepository(Config)
export default class ConfigRepository extends Repository<Config> {
	async getConfig(env: string) {
		const config = await this.findOne({where: {env}})
		return config;
	}

	async setMaxCapacity(env: string, capacity: number) {
		const config = await this.findOne({where: {env}})
		config.setCapacity(capacity);
		await this.save(config);
		return config;
	}
}
