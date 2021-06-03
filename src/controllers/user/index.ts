
import BaseRoute from '../baseRoute';
import Check from './check';
import Login from './login';
import Status from './status';

export default class User extends BaseRoute {
  public static path = '/user';
  private static instance: User;

  private constructor () {
    super();
    this.init();
  }

  static get router () {
    if (!User.instance) {
      User.instance = new User();
    }
    return User.instance.router;
  }

  private init () {
    // 유저
    this.router.use(Login.path, Login.router);

    // 체크인아웃
    this.router.use(Check.path, Check.router);

    // 유저상태
    this.router.use(Status.path, Status.router);
  }
}
