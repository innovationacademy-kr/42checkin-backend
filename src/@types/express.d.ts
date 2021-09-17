import { IJwtUser } from '../modules/jwt.strategy'
import { Users } from '../models/users';

declare module "express" {
  export interface Request {
	clientIp: string;
    user: {
		jwt: IJwtUser,
		ft: Users,
	}
  }
}