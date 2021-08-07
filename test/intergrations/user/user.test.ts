import request from 'supertest';
import { app, dbConnectionState } from '../../../src/app';
import { describe, it, before } from 'mocha';
import { expect } from 'chai';
import httpStatus from 'http-status';
import { sessionCookie } from '../env';

describe('checkin, checkout process test', async () => {
	// const server = request(app);
	// 테스트 코드가 작동하기 전, 특정 행위를 만족하는지 확인한다.
	before(async () => {
		console.log('before');

		if (dbConnectionState) {
			await request(app).post(`/user/checkOut`).set('Cookie', [ sessionCookie ]);
		} else {
			// 서버에서 디비가 연결될 경우 emit하는 값을 감지한 후 done()을 호출해, 테스트 케이스를 시작한다.
			app.on('dbconnected', async () => {
				await request(app).post(`/user/checkOut`).set('Cookie', [ sessionCookie ]);
			});
		}
	});

	describe(`check user status`, () => {
		// 유저 상태확인
		it('it shows information', async () => {
			const res = await request(app).get(`/user/status`).set('Cookie', [ sessionCookie ]);
			expect(res.body.user.login).to.equal('yurlee');
			expect(res.body.user).to.have.all.keys('login', 'card');
			expect(res.body.cluster).to.have.all.keys('gaepo', 'seocho');
			expect(res.body.isAdmin).to.be.a('boolean');
		});
	});

	// 체크인
	const cardID = 9;
	const userID = 248;
	describe(`checkin with no.${cardID} card`, () => {
		it('success checkin', async () => {
			const res = await request(app).post(`/user/checkIn/${cardID}`).set('Cookie', [ sessionCookie ]);
			expect(res.body.result).to.equal(true);
		});
	});

	// 같은번호로 체크인
	describe(`checkin with no.${cardID} card again`, () => {
		it('duplicate checkin rejected', async () => {
			const res = await request(app).post(`/user/checkIn/${cardID}`).set('Cookie', [ sessionCookie ]);
			expect(res.status).to.equal(httpStatus.BAD_REQUEST);
			expect(res.body.code).to.equal(httpStatus.BAD_REQUEST);
		});
	});

	// 체크인 후, 상태 확인
	describe(`check user status, after checkin`, () => {
		it('user status changed', async () => {
			const res = await request(app).get(`/user/status`).set('Cookie', [ sessionCookie ]);
			expect(res.body.user.login).to.equal('yurlee');
			expect(res.body.user.card).to.equal(cardID);
		});
	});

	// 체크아웃
	describe(`check user status, after checkin`, () => {
		it('checkout success', async () => {
			const res = await request(app).post(`/user/checkOut`).set('Cookie', [ sessionCookie ]);
			expect(res.body.result).to.equal(true);
		});
	});

	describe(`checkin with no.${cardID} card for next testcase`, () => {
		it('success checkin', async () => {
			const res = await request(app).post(`/user/checkIn/${cardID}`).set('Cookie', [ sessionCookie ]);
			expect(res.body.result).to.equal(true);
		});
	});

	// 체크인 후, 강제 체크아웃
	describe(`force checkout, after checkin`, () => {
		it('force  checkout success', async () => {
			const res = await request(app).post(`/user/forceCheckout/${userID}`).set('Cookie', [ sessionCookie ]);
			expect(res.body.result).to.equal(true);
		});
	});

	// 체크인 후, 강제 체크아웃 중복실행
	describe(`duplicated force checkout, after force checkout`, () => {
		it('force checkout failed', async () => {
			const res = await request(app).post(`/user/forceCheckout/${userID}`).set('Cookie', [ sessionCookie ]);
			expect(res.status).to.equal(httpStatus.NOT_FOUND);
			expect(res.body.code).to.equal(httpStatus.NOT_FOUND);
		});
	});
});
