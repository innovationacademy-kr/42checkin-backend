import config from '@config/configuration';
import User from '@entities/user.entity';

import jwt from 'jsonwebtoken';
import { MyLogger } from './logger.service';

export default class AuthService {
  private static instance: AuthService;
  private logger: MyLogger;

  constructor() {
    this.logger = new MyLogger();
  }

  static get service() {
		if (!AuthService.instance) {
			AuthService.instance = new AuthService();
		}
		return AuthService.instance;
	}

  async generateToken(user: User): Promise<string> {
    try {
      this.logger.debug('generating token...');
      const payload = { username: user.getName(), sub: user.getId() };
      const token = jwt.sign(payload, config.jwt.secret);
      this.logger.debug('new token generated : ', token);
      return token;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
}
