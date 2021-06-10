import winston from 'winston';
import winstonDaily from 'winston-daily-rotate-file';
const { printf, timestamp, combine } = winston.format;

export class MyLogger {
	// Define log format
	private logDir = 'logs';
	private logFormat = printf((info) => {
		return `${info.timestamp} ${info.level}: ${info.message}`;
	});
	private logger: winston.Logger;

	constructor() {
		this.logger = winston.createLogger({
			format: combine(
				timestamp({
					format: 'YYYY-MM-DD HH:mm:ss'
				}),
				this.logFormat
			),
			transports: [
				// info 레벨 로그를 저장할 파일 설정
				new winstonDaily({
					level: 'info',
					datePattern: 'YYYY-MM-DD',
					dirname: this.logDir + '/info',
					filename: `%DATE%.log`,
					maxFiles: 7, // 30일치 로그 파일 저장
					zippedArchive: true
				}),
				// error 레벨 로그를 저장할 파일 설정
				new winstonDaily({
					level: 'error',
					datePattern: 'YYYY-MM-DD',
					dirname: this.logDir + '/error', // error.log 파일은 /logs/error 하위에 저장
					filename: `%DATE%.error.log`,
					maxFiles: 7,
					zippedArchive: true
				}),
				// error 레벨 로그를 저장할 파일 설정
				new winstonDaily({
					level: 'warn',
					datePattern: 'YYYY-MM-DD',
					dirname: this.logDir + '/warn',
					filename: `%DATE%.warn.log`,
					maxFiles: 7,
					zippedArchive: true
				}),
				new winstonDaily({
					level: 'notice',
					datePattern: 'YYYY-MM-DD',
					dirname: this.logDir + '/notice',
					filename: `%DATE%.notice.log`,
					maxFiles: 7,
					zippedArchive: true
				}),
				new winstonDaily({
					level: 'debug',
					datePattern: 'YYYY-MM-DD',
					dirname: this.logDir + '/debug',
					filename: `%DATE%.debug.log`,
					maxFiles: 7,
					zippedArchive: true
				}),
			]
		});

    // Production 환경이 아닌 경우(dev 등)
    if (process.env.NODE_ENV !== 'production') {
      this.logger.add(new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),  // 색깔 넣어서 출력
          winston.format.simple(),  // `${info.level}: ${info.message} JSON.stringify({ ...rest })` 포맷으로 출력
        )
      }));
    }
	}


	notice(...trace: any[]) {
		this.logger.notice(trace);
	}
	error(...trace: any[]) {
		this.logger.error(trace);
	}
	warn(...trace: any[]) {
		this.logger.warn(trace);
	}
	debug(...trace: any[]) {
		this.logger.debug(trace);
	}
	info(...trace: any[]) {
		this.logger.info(trace);
	}

	// trace(...trace: any[]) {
	//   console({
	//     rootDir: path.dirname(__dirname),
	//     stackIndex: 1,
	//     level: config.log.debug === true ? 'debug' : 'error',
	//   }).log(trace)
	// }
	// logger_info = dailyfile({
	//   root: path.dirname(__dirname) + '/logs',
	//   allLogsFileName: 'info.42CheckIn',
	//   stackIndex: 1,
	// });

	// logger_log = dailyfile({
	//   root: path.dirname(__dirname) + '/logs',
	//   allLogsFileName: 'log.42CheckIn',
	//   stackIndex: 1,
	//   level: 'trace',
	// });

	// logger_error = dailyfile({
	//   root: path.dirname(__dirname) + '/logs',
	//   allLogsFileName: 'error.42CheckIn',
	//   stackIndex: 1,
	// });

	// logger_debug = dailyfile({
	//   root: path.dirname(__dirname) + '/logs',
	//   allLogsFileName: 'debug.42CheckIn',
	//   stackIndex: 1,
	//   level: 'error',
	//   // level: config.log.debug === true ? 'debug' : 'error',
	// });

	// log(...trace: any[]) {
	//   this.logger_log.trace(trace);
	// }
	// error(...trace: any[]) {
	//   this.logger_error.error(trace);
	// }
	// warn(...trace: any[]) {
	//   this.logger_log.warn(trace);
	// }
	// debug(...trace: any[]) {
	//   this.logger_debug.debug(trace);
	// }
	// info(...trace: any[]) {
	//   this.logger_info.info(trace);
	// }

	// trace(...trace: any[]) {
	//   console({
	//     rootDir: path.dirname(__dirname),
	//     stackIndex: 1,
	//     level: config.log.debug === true ? 'debug' : 'error',
	//   }).log(trace)
	// }
}
