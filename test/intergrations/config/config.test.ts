import request from 'supertest';
import { app, dbConnectionState } from '../../../src/app';
import { describe, it, before } from 'mocha';
import { expect } from 'chai';
import httpStatus from 'http-status';
import { CLUSTER_CODE } from '../../../src/enum/cluster';
import { sessionCookie } from '../env';

describe('config api test', async () => {
	before((done) => {
		if (dbConnectionState) {
			done();
		}
		app.on('dbconnected', () => {
			done();
		});
	});

	describe((`설정 테이블의 값을 조회`), () => {
		it('현재 환경의 이름값으로 값을 조회합니다.', async () => {
			const res = await request(app).get(`/config`).set('Cookie', [sessionCookie]);
			expect(res.body.maxCapacity).to.be.a('number')
			expect(res.body.env).to.be.a('string')
		});
	});

	describe((`설정 테이블의 값을 수정`), () => {
		it('현재 환경의 이름값과 env가 일치하는 row를 수정합니다.', async () => {
			const res = await request(app).patch(`/config`).send({ capacity: 200 }).set('Cookie', [sessionCookie]);
			expect(res.body.maxCapacity).to.be.a('number')
			expect(res.body.env).to.be.a('string')
		});
	});
});
