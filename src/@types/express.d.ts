import { IJwtUser } from '../strategy/jwt.strategy'
import User from '../entities/user.entity';

declare module "express" {
  export interface Request {
    user: {
		jwt: IJwtUser,
		ft: User,
	}
  }
}