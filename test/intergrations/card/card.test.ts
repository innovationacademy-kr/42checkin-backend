import request from 'supertest';
import { app, dbConnectionState } from '../../../src/app';
import { describe, it, before } from 'mocha';
import { expect } from 'chai';
import httpStatus from 'http-status';
import { CLUSTER_CODE } from '../../../src/enum/cluster';
import { sessionCookie } from '../env';

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
		it('success checkin', async (done) => {
			const res = await request(app).post(`/user/checkIn/${cardNO}`).set('Cookie', [sessionCookie]);
			// expect(res.body.result).to.equal(true);
			done();
		});
	});

	describe((`release card status`), () => {
		// 특정 카드의 점유 상태를 false로 바꿈 (트랙잭션오류로 유저의 상태는 바뀌는데, 카드의 상태가 안변하는 경우가 있음 이를 위해 있는 API)
		it('it updates card status; using: true -> false', async () => {
			const res = await request(app).post(`/card/release/${cardNO}`).set('Cookie', [sessionCookie]);
			expect(res.body).to.true;
		});
	});

	describe((`release card status, but already released`), () => {
		it('fail to release card', async () => {
			// 이미 체크아웃된 카드로 한번 더 사용해제 시도
			const res = await request(app).post(`/card/release/${cardNO}`).set('Cookie', [sessionCookie]);
			expect(res.body.code).to.equal(httpStatus.BAD_REQUEST);
		});
	});

	describe((`release card status, but not founded card`), () => {
		it('fail to release card', async () => {
			// 존재하지 않는 카드번호로 사용해제 시도
			const res = await request(app).post(`/card/release/9999`).set('Cookie', [sessionCookie]);
			expect(res.body.code).to.equal(httpStatus.NOT_FOUND);
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
