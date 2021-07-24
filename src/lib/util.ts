import { getConnection, ObjectType } from 'typeorm';
import moment from 'moment';

export const isError = (e: any) => {
	return e && e.stack && e.message;
};

export const getRepo = <T>(repo: ObjectType<T>) => {
	return getConnection().getCustomRepository<T>(repo);
};

export const getTimeFormat = (timestamp: moment.MomentInput, format: string) => {
	const str = moment(timestamp).tz('Asia/Seoul').format(format);
	return str;
}