import request from 'supertest';
import { app, dbConnectionState } from '../../../src/app';
import { describe, it, before } from 'mocha';
import { expect } from 'chai';
import httpStatus from 'http-status';
import { CLUSTER_CODE } from '../../../src/enum/cluster';
import { sessionCookie } from '../env';
import DB from '../../../src/config/database';

/**
 * 최대 수용인원수 가까이 체크인 했을때, 경계 테스트
 * 1. 로그인 (가정) V
 * 2. 쿠키 받음 V
 * 3. 회원수 체크 V
 * 4. 모두 강제 체크아웃 시키기 V
 * 5. 최대수용인원 6으로 설정 V
 * 6. 한명씩 체크인 <- 어떻게 해야하는가? -> (cardRepo에서 카드만 using 상태로 변경)
 * 7. 남은인원 5명이하일 경우 디스코드 알림발송
 * 8. 남은인원 0명일 경우 체크인 시도
 */
describe('최대 수용인원수 가까이 입장했을때, 체크인 시스템 경계 테스트 진행', async () => {
	let originCapacity: number;

	before((done) => {
		if (dbConnectionState) {
			done();
		}
		// 서버에서 디비가 연결될 경우 emit하는 값을 감지한 후 done()을 호출해, 테스트 케이스를 시작한다.
		app.on('dbconnected', () => {
			const forceCheckoutAll = (users: any) =>
				Promise.all(
					users.map((log: { user: any }) => {
						return request(app)
							.post(`/user/forceCheckout/${log.user._id}`)
							.set('Cookie', [ sessionCookie ]);
					})
				);
			const checkoutAllIn = (cluster: number) =>
				request(app)
					.get(`/log/allCard/${cluster}`)
					.set('Cookie', [ sessionCookie ])
					.then(async (res) => await forceCheckoutAll(res.body));
			checkoutAllIn(CLUSTER_CODE.seocho).then(() => {
				checkoutAllIn(CLUSTER_CODE.gaepo).then(() => {
					request(app).get(`/card/using`).set('Cookie', [ sessionCookie ]).then((res) => {
						console.log(res.body);
						done();
					});
				});
			});
		});
	});

	describe(`시나리오 테스트시작전 준비상황 확인 및 환경 설정`, () => {
		it('체크인한 유저가 0명인지 확인', async () => {
			const res = await request(app).get(`/card/using`).set('Cookie', [ sessionCookie ]);
			expect(res.body[CLUSTER_CODE[0]]).to.be.equal(0);
			expect(res.body[CLUSTER_CODE[1]]).to.be.equal(0);
		});

		it('최대수용가능 인원수를 확인', async () => {
			const res = await request(app).patch(`/config`).send({ capacity: 6 }).set('Cookie', [ sessionCookie ]);
			originCapacity = res.body.maxCapacity;
			expect(res.body.maxCapacity).to.be.a('number');
			expect(res.body.env).to.be.a('string');
		});

		it('최대수용가능 인원수를 6명으로 수정', async () => {
			const res = await request(app).patch(`/config`).send({ capacity: 6 }).set('Cookie', [ sessionCookie ]);
			expect(res.body.maxCapacity).to.be.equal(6);
			expect(res.body.env).to.be.a('string');
		});
	});

	describe(`출입가능 인원이 5명이하인 경우 체크인 테스트`, () => {
		it('카드 하나를  사용상태로 변경', async () => {
			const card = await DB.card.update({ using: true }, { where: { cardId: 12 } });
			const res = await request(app).get(`/card/using`).set('Cookie', [ sessionCookie ]);
			expect(res.body.gaepo).to.be.equal(1);
		});

		it('체크인한 유저가 1명인가?', async () => {
			const res = await request(app).get(`/card/using`).set('Cookie', [ sessionCookie ]);
			expect(res.body.gaepo).to.be.equal(1);
		});

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
			const res = await request(app).patch(`/config`).send({ capacity: 1 }).set('Cookie', [ sessionCookie ]);
			expect(res.body.maxCapacity).to.be.equal(1);
			expect(res.body.env).to.be.a('string');
		});

		it('체크인이 불가능한가?', async () => {
			// 체크인
			const cardID = 9;
			const res = await request(app).post(`/user/checkIn/${cardID}`).set('Cookie', [ sessionCookie ]);
			expect(res.body.code).to.equal(httpStatus.CONFLICT);
		});

		it('사용상태로 변경했던 카드를 사용안함으로 되돌림', async () => {
			const card = await DB.card.update({ using: false }, { where: { cardId: 12 } });
			const res = await request(app).get(`/card/using`).set('Cookie', [ sessionCookie ]);
			expect(res.body.gaepo).to.be.equal(0);
		});

		it('최대수용가능 인원수를 원래대로 복구', async () => {
			const res = await request(app)
				.patch(`/config`)
				.send({ capacity: originCapacity })
				.set('Cookie', [ sessionCookie ]);
			expect(res.body.maxCapacity).to.be.equal(originCapacity);
			expect(res.body.env).to.be.a('string');
		});
	});
});
