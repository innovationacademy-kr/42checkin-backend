import env from '@modules/env';
import axios from "axios";
import { CLUSTER_CODE, CLUSTER_TYPE } from "@modules/cluster";
import logger from "./logger";
import FormData from 'form-data';

/**
 * 디스코드 알림 발송
 */
export const noticer = async (type: number, leftover: number) => {
	if (env.node_env === 'production') {
		const form = new FormData();
		form.append('content', `${leftover}명 남았습니다`);
		if (type === 1 || type === 0) {
			const { id, pw } = env.discord[CLUSTER_CODE[type] as CLUSTER_TYPE];
			axios
				.post(`https://discord.com/api/webhooks/${id}/${pw}`, form, { ...form.getHeaders() })
				.then((res) => {
					logger.info({
                        type: 'action',
                        message: 'discord alram',
                        data: res.data,
                    });
				})
				.catch((e) => logger.error(e));
		}
	}
};