import config from '@config/configuration';
import axios from 'axios';
import { Tracer } from 'tracer';
import ApiError from './errorHandle';

const SLACK_API = 'https://hooks.slack.com/services/';
type IError = Tracer.LogOutput & { statusCode: number; uid: unknown };

const getLine = (str: string, from: number, to: number) => str.split('\n').slice(from, to).join('\n');
const getErrorFormat = ({ stack, file, line, uid, statusCode, args, message }: IError) => {
	let errorTitle = '';
	if (args[1][0] instanceof ApiError) {
		errorTitle = args[1][0].message;
	} else {
		errorTitle = getLine(message, 0, 3);
	}

	const blockFormat = {
		blocks: [
			{
				type: 'header',
				text: {
					type: 'plain_text',
					text: `[checkin - ${config.env}] ${errorTitle} (${file}:${line})`,
					emoji: true
				}
			},
			{
				type: 'section',
				text: {
					type: 'mrkdwn',
					text: `*id*: ${uid}\n*status code*: ${statusCode}`
				}
			},
			{
				type: 'divider'
			},
			{
				type: 'section',
				text: {
					type: 'mrkdwn',
					text: `\`\`\`${getLine(stack, 0, 5)}\`\`\``
				}
			}
		]
	};
	return blockFormat
};

export const sendErrorMessage = (error: IError) => {
	const body = getErrorFormat(error);
	axios.post(`${SLACK_API}${config.webHook.alarm}`, body);
};
