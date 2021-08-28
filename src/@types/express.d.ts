import { IJwtUser } from '../strategy/jwt.strategy'
import { UserModel } from '../model/user';

declare module "express" {
  export interface Request {
    user: {
		jwt: IJwtUser,
		ft: UserModel,
	}
  }
}