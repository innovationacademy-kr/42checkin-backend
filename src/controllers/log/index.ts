import BaseRoute from '../baseRoute';
import CheckLog from './checkLog';

export default class Log extends BaseRoute {
	public static path = '/log';
	private static instance: Log;

	private constructor() {
		super();
		this.init();
	}

	static get router() {
		if (!Log.instance) {
			Log.instance = new Log();
		}
		return Log.instance.router;
	}

	private init() {
		this.router.use(CheckLog.path, CheckLog.router);
	}
}
