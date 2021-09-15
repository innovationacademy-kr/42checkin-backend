import { IJwtUser } from '../modules/jwt.strategy'
import { Users } from '../models/users';

declare module "express" {
  export interface Request {
    user: {
		jwt: IJwtUser,
		ft: Users,
	}
  }
}