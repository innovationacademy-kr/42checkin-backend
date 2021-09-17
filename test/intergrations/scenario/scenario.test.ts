import request from 'supertest';
import { app } from '../../../src/app';
import { describe, it, before } from 'mocha';
import { expect } from 'chai';
import httpStatus from 'http-status';
import { CLUSTER_CODE } from '../../../src/modules/cluster';
import { sessionCookie } from '../env';
import { Config as IConfig } from '../../../src/models/config';
import { sequelize } from '../../../src/models';
import { getTimeFormat } from '../../../src/modules/util';

/**
 * 최대 수용인원수 가까이 체크인 했을때, 경계 테스트
 * 1. 로그인 (가정) V
 * 2. 쿠키 받음 V
 * 3. 회원수 체크 V
 * 4. 모두 강제 체크아웃 시키기 V
 * 5. 최대수용인원 5으로 설정 V
 * 6. 한명씩 체크인 <- 어떻게 해야하는가? -> (cardRepo에서 카드만 using 상태로 변경)
 * 7. 남은인원 5명이하일 경우 디스코드 알림발송
 * 8. 남은인원 0명일 경우 체크인 시도
 */
describe('최대 수용인원수 가까이 입장했을때, 체크인 시스템 경계 테스트 진행', async () => {
	let originCapacity: IConfig;
    let date = getTimeFormat(new Date(), 'YYYY-MM-DD');

    // before(() => {
    //     try {
    //         sequelize.authenticate().then(async () => {
    //             await request(app).post(`/user/checkOut`).set('Cookie', [sessionCookie]);
    //         })
    //     } catch (e) {
    //         console.log(e);
    //     }
    // });

	before(async () => {
		// 서버에서 디비가 연결될 경우 emit하는 값을 감지한 후 done()을 호출해, 테스트 케이스를 시작한다.
		app.on('dbconnected', async () => {
			const forceCheckoutAll = (users: any) =>
				Promise.all(
					users.map((log: { User: any }) => {
						return request(app)
							.post(`/user/forceCheckout/${log.User._id}`)
							.set('Cookie', [ sessionCookie ]);
					})
				);
			const checkoutAllIn = (cluster: number) =>
				request(app)
					.get(`/log/checkIn/${cluster}`)
					.set('Cookie', [ sessionCookie ])
					.then(async (res) => await forceCheckoutAll(res.body));
			await checkoutAllIn(CLUSTER_CODE.seocho);
			await checkoutAllIn(CLUSTER_CODE.gaepo);
            const res = await request(app).get(`/user/using`).set('Cookie', [ sessionCookie ])
		});
	});

	describe(`시나리오 테스트시작전 준비상황 확인 및 환경 설정`, () => {
		it('체크인한 유저가 0명인지 확인', async () => {
            const res = await request(app).get(`/user/using`).query({ date }).set('Cookie', [ sessionCookie ]);
			expect(res.body[CLUSTER_CODE[0]]).to.be.equal(0);
			expect(res.body[CLUSTER_CODE[1]]).to.be.equal(0);
		});

		it('최대수용가능 인원수를 확인', async () => {
            const res = await request(app).get(`/config`).query({ date }).set('Cookie', [ sessionCookie ]);
			originCapacity = res.body;
			expect(res.body.gaepo).to.be.a('number');
			expect(res.body.env).to.be.a('string');
		});

		it('최대수용가능 인원수를 5명으로 수정', async () => {
            const res = await request(app).put(`/config`).send({ env: {...originCapacity, gaepo: 5 }, date }).set('Cookie', [ sessionCookie ]);
            expect(res.body.gaepo).to.be.equal(5);
			expect(res.body.env).to.be.a('string');
		});
	});

	describe(`출입가능 인원이 5명이하인 경우 체크인 테스트`, () => {
		it('5명이하일때, 체크인 시도 반환값 중 notice가 true인가?', async () => {
			// 체크인
			const cardID = 9;
			const res = await request(app).post(`/user/checkIn/${cardID}`).set('Cookie', [ sessionCookie ]);
			expect(res.body.result).to.equal(true);
			expect(res.body.notice).to.equal(true);
		});
	});

	describe(`출입가능인원이 꽉찬 경우 테스트`, () => {
		it('유저의 상태로 체크아웃으로 변경', async () => {
			const res = await request(app).post(`/user/checkOut`).set('Cookie', [ sessionCookie ]);
			expect(res.body.result).to.equal(true);
		});

		it('최대수용가능 인원수를 1명으로 수정', async () => {
            const res = await request(app).put(`/config`).send({ env: { ...originCapacity, gaepo: 1 }, date }).set('Cookie', [ sessionCookie ]);
            expect(res.body.gaepo).to.be.equal(1);
			expect(res.body.env).to.be.a('string');
		});

		it('체크인이 불가능한가?', async () => {
			// 체크인
			const cardID = 9;
			const res = await request(app).post(`/user/checkIn/${cardID}`).set('Cookie', [ sessionCookie ]);
			expect(res.body.code).to.equal(httpStatus.CONFLICT);
		});

		it('최대수용가능 인원수를 원래대로 복구', async () => {
			const res = await request(app)
				.put(`/config`)
				.send({ env: originCapacity, date })
				.set('Cookie', [ sessionCookie ]);
			expect(res.body.gaepo).to.be.equal(originCapacity.gaepo);
			expect(res.body.env).to.be.a('string');
		});
	});
});
