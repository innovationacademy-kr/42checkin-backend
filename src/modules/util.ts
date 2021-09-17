import moment from 'moment-timezone';

const TZ = 'Asia/Seoul';

export const isError = (e: any) => {
	return e && e.stack && e.message;
};

export const getTimeFormat = (timestamp: moment.MomentInput, format: string) => {
	const str = moment(timestamp).tz(TZ).format(format);
	return str;
}

export const now = () => {
    return moment().tz(TZ);
}