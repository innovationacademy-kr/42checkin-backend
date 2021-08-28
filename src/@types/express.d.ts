import { IJwtUser } from '../strategy/jwt.strategy'
import User from '../entities/user.entity';
import { UserModel } from '../model/user';

declare module "express" {
  export interface Request {
    user: {
		jwt: IJwtUser,
		ft: UserModel,
	}
  }
}