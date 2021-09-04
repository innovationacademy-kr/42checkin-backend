import moment from 'moment-timezone';

export const isError = (e: any) => {
	return e && e.stack && e.message;
};

export const getTimeFormat = (timestamp: moment.MomentInput, format: string) => {
	const str = moment(timestamp).tz('Asia/Seoul').format(format);
	return str;
}