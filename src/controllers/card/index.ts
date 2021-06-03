
import BaseRoute from '../baseRoute';
import CheckIn from './checkin';

export default class Card extends BaseRoute {
  public static path = '/card';
  private static instance: Card;

  private constructor () {
    super();
    this.init();
  }

  static get router () {
    if (!Card.instance) {
      Card.instance = new Card();
    }
    return Card.instance.router;
  }

  private init () {
    // 유저
    this.router.use(CheckIn.path, CheckIn.router);
  }
}
