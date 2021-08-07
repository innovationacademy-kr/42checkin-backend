import request from 'supertest';
import { app, dbConnectionState } from '../../../src/app';
import { describe, it, before } from 'mocha';
import { expect } from 'chai';
import httpStatus from 'http-status';
import { CLUSTER_CODE } from '../../../src/enum/cluster';
import { sessionCookie } from '../env';
import { getRepo } from '../../../src/lib/util';
import UserRepository from '../../../src/repository/user.repository';

describe('card api test', async () => {
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

	describe((`get using card list`), () => {
		// 사용중인 카드 리스트
		it('it return card list currently in use', async () => {
			const res = await request(app).get(`/card/usingCard`).set('Cookie', [sessionCookie]);
			expect(res.body).to.an('array');
			if (res.body.length) {
				expect(res.body[0]).to.have.keys('type', 'cardId', 'using', 'createdAt', 'updatedAt', 'deletedAt')
			}
		});
	});

	describe((`get all card list`), () => {
		// card테이블에 존재하는 모든 리스트 가져오기
		it('it return all card list', async () => {
			const res = await request(app).get(`/card/all`).set('Cookie', [sessionCookie]);
			expect(res.body).to.an('array');
			if (res.body.length) {
				expect(res.body[0]).to.have.keys('type', 'cardId', 'using', 'createdAt', 'updatedAt', 'deletedAt')
			}
		});
	});

	describe((`get using card count`), () => {
		// 클러스터별 사용중인 카드 카운트
		it('it return card count by cluster', async () => {
			const res = await request(app).get(`/card/using`).set('Cookie', [sessionCookie]);
			expect(res.body).to.have.all.keys('seocho', 'gaepo')
			expect(res.body.seocho).to.a('number');
			expect(res.body.gaepo).to.a('number');
		});
	});

	const cardNO = 9;

	// 특정 카드번호로 체크인
	describe((`checkin with no.${cardNO} card for next testcase`), () => {
		it('success checkin', async () => {
			const res = await request(app).post(`/user/checkIn/${cardNO}`).set('Cookie', [sessionCookie]);
			expect(res.body.result).to.equal(true);
		});
	});


	describe((`create card`), () => {
		it('create N card; N = (end - start)', async () => {
			// 카드 생성 (end - start)만큼 카드를 생성함
			const res = await request(app)
				.post(`/card/create/${CLUSTER_CODE.gaepo}`)
				.query({ start: 1, end: 2 })
				.set('Cookie', [sessionCookie]);
			expect(res.body.result).to.true
		});
	});

	describe((`create card, but no query`), () => {
		it('fail to create card. because query', async () => {
			const res = await request(app)
				.post(`/card/create/${CLUSTER_CODE.gaepo}`)
				.set('Cookie', [sessionCookie]);
			expect(res.body.code).to.equal(httpStatus.BAD_REQUEST);
		});
	});

	describe((`create card, but strange cluster code`), () => {
		it('fail to create card. because query', async () => {
			const res = await request(app)
				.post(`/card/create/${123}`)
				.set('Cookie', [sessionCookie]);
			expect(res.body.code).to.equal(httpStatus.BAD_REQUEST);
		});
	});
});
