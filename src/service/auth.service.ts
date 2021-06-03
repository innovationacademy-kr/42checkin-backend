import config from '@config/configuration';
import User from '@entities/user.entity';

import jwt from 'jsonwebtoken';

export default class AuthService {
  private static instance: AuthService;

  constructor() {}

  static get service() {
		if (!AuthService.instance) {
			AuthService.instance = new AuthService();
		}
		return AuthService.instance;
	}

  async generateToken(user: User): Promise<string> {
    try {
      const payload = { username: user.getName(), sub: user.getId() };
      const token = jwt.sign(payload, config.jwt.secret);
      return token;
    } catch (e) {
      throw e;
    }
  }
}
