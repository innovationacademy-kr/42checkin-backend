import { Op } from "sequelize";

export enum CLUSTER_CODE {
	'gaepo',
	'seocho'
}
export type CLUSTER_TYPE = 'gaepo' | 'seocho';

export const clusterCondition =  {
    [CLUSTER_CODE.gaepo]: { [Op.lt]: 999 },
    [CLUSTER_CODE.seocho]: { [Op.gt]: 1000 },
}

export type USER_TYPE = 'cadet' | 'admin';
export type CHECK_STATE = 'checkIn' | 'checkOut';