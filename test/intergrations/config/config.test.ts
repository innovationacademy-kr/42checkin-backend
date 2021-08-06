import request from 'supertest';
import { app, dbConnectionState } from '../../../src/app';
import { describe, it, before } from 'mocha';
import { expect } from 'chai';
import httpStatus from 'http-status';
import { CLUSTER_CODE } from '../../../src/enum/cluster';
import { sessionCookie } from '../env';

describe('config api test', async () => {
	// const server = request(app);
	// 테스트 코드가 작동하기 전, 특정 행위를 만족하는지 확인한다.
	before((done) => {
		if (dbConnectionState) {
			done();
		}
		// 서버에서 디비가 연결될 경우 emit하는 값을 감지한 후 done()을 호출해, 테스트 케이스를 시작한다.
		app.on('dbconnected', () => {
			done();
		});
	});

	describe((`get config`), () => {
		// 사용중인 카드 리스트
		it('it return current environment row', async () => {
			const res = await request(app).get(`/config`).set('Cookie', [sessionCookie]);
			expect(res.body.maxCapacity).to.be.a('number')
			expect(res.body.env).to.be.a('string')
		});
	});

	describe((`set config`), () => {
		// 사용중인 카드 리스트
		it('it change environment row, and return row', async () => {
			const res = await request(app).patch(`/config`).send({ capacity: 200 }).set('Cookie', [sessionCookie]);
			expect(res.body.maxCapacity).to.be.a('number')
			expect(res.body.env).to.be.a('string')
		});
	});
});
