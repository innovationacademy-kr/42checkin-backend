import request from 'supertest';
import { app, dbConnectionState } from '../../../src/app';
import { describe, it, before } from 'mocha';
import { expect } from 'chai';
import httpStatus from 'http-status';
import { CLUSTER_CODE } from '../../../src/enum/cluster';
import { sessionCookie } from '../env';

describe('log api test', async () => {
	// 테스트 코드가 작동하기 전, 특정 행위를 만족하는지 확인한다.
	before((done) => {
		if (dbConnectionState) {
			done();
		} else {
			// 서버에서 디비가 연결될 경우 emit하는 값을 감지한 후 done()을 호출해, 테스트 케이스를 시작한다.
			app.on('dbconnected', () => {
				done();
			});
		}
	});

	const cardID = 9;
	describe((`get no.${cardID} card logs`), () => {
		// 사용중인 카드 리스트
		it(`it return no.${cardID} card logs`, async () => {
			const res = await request(app).get(`/log/card/${cardID}`).set('Cookie', [sessionCookie]);
			expect(res.body).to.an('array');
			if (res.body.length) {
				expect(res.body[0]).to.have.keys('user', 'card', 'logType', 'logId', 'createdAt', 'updatedAt', 'deletedAt', 'cardId')
			}
		});
	});

	describe((`get all card logs`), () => {
		// 모든 로그 보기
		it('it return all card logs', async () => {
			const res = await request(app).get(`/log/card/${cardID}`).set('Cookie', [sessionCookie]);
			expect(res.body).to.an('array');
			expect(res.body[0]).to.have.keys('user', 'card', 'logType', 'logId', 'createdAt', 'updatedAt', 'deletedAt', 'cardId')
		});
	});

	describe((`get all card logs by cluster`), () => {
		// 특정 클러스터에서 사용된  카드로그 보기
		it('it return all card logs', async () => {
			const res = await request(app).get(`/log/${CLUSTER_CODE[CLUSTER_CODE.gaepo]}`).set('Cookie', [sessionCookie]);
			expect(res.body).to.an('array');
			expect(res.body[0]).to.have.keys('user', 'card', 'logType', 'logId', 'createdAt', 'updatedAt', 'deletedAt', 'cardId')
			expect(res.body[0].card.type).to.equal(CLUSTER_CODE.gaepo)
		});
	});

	const userName = 'yurlee';
	describe((`get all card logs by ${userName}`), () => {
		// 특징 유저의 키드 사용 내역 보기
		it(`it return card logs by ${userName}`, async () => {
			const res = await request(app).get(`/log/user/${userName}`).set('Cookie', [sessionCookie]);
			expect(res.body).to.an('array');
			expect(res.body[0]).to.have.keys('user', 'card', 'logType', 'logId', 'createdAt', 'updatedAt', 'deletedAt', 'cardId');
			expect(res.body[0].user.userName).to.equal(userName);
		});
	});

	describe((`get not-returned card logs by cluster`), () => {
		// 클러스터별 미반납 카드로그 보기
		it(`it not-returned card logs by cluster`, async () => {
			const res = await request(app).get(`/log/Checkin/${CLUSTER_CODE.gaepo}`).set('Cookie', [sessionCookie]);
			expect(res.body).to.an('array');
			expect(res.body[0]).to.have.keys('user', 'card', 'logType', 'logId', 'createdAt', 'updatedAt', 'deletedAt', 'cardId');
			expect(res.body[0].card.type).to.equal(CLUSTER_CODE.gaepo)
		});
	});

	describe((`get all card logs by cluster`), () => {
		// 클러스터별 모든 카드 정보 보기
		it(`it all card logs by cluster`, async () => {
			const res = await request(app).get(`/log/allCard/${CLUSTER_CODE.gaepo}`).set('Cookie', [sessionCookie]);
			expect(res.body).to.an('array');
			expect(res.body[0]).to.have.keys('user', 'card', 'logType', 'logId', 'createdAt', 'updatedAt', 'deletedAt', 'cardId');
			expect(res.body[0].card.type).to.equal(CLUSTER_CODE.gaepo)
		});
	});

	describe((`get not-returned card logs by cluster, but strange cluster code`), () => {
		// 클러스터별 미반납 카드로그 보기
		it(`fail`, async () => {
			const res = await request(app).get(`/log/Checkin/123`).set('Cookie', [sessionCookie]);
			expect(res.body.code).to.equal(httpStatus.NOT_FOUND);
		});
	});

	describe((`get all card logs by cluster, but strange cluster code`), () => {
		// 클러스터별 모든 카드 정보 보기
		it(`fail`, async () => {
			const res = await request(app).get(`/log/allCard/123`).set('Cookie', [sessionCookie]);
			expect(res.body.code).to.equal(httpStatus.NOT_FOUND);
		});
	});
});