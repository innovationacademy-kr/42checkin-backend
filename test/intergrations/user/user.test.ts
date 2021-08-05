import request from 'supertest';
import { app } from '../../../src/app';
import { describe, it, before } from 'mocha';
import { expect } from 'chai';
import FormData from 'form-data';
import axios from 'axios';

const sessionCookie = 'w_auth_local=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Inl1cmxlZSIsInN1YiI6MjQ4LCJpYXQiOjE2Mjc2MzQ2MzksImV4cCI6MTYyODIzOTQzOX0.8JTNegZ_s52v8MUHjgwUV8l_Npy5Y0qGcTTG30Epapw';

describe('checkin, checkout process test', async () => {
	const server = request(app);
	// 테스트 코드가 작동하기 전, 특정 행위를 만족하는지 확인한다.
	before((done) => {
		// 서버에서 디비가 연결될 경우 emit하는 값을 감지한 후 done()을 호출해, 테스트 케이스를 시작한다.
		app.on('dbconnected', () => {
			done();
		});
	});

	describe((`check user status`), () => {
		// 유저 상태확인
		it('it shows information', async () => {
			const res = await server.get(`/user/status`).set('Cookie', [sessionCookie]);
			expect(res.body.user.login).to.equal('yurlee');
			expect(res.body.user.card).to.equal(null);
			expect(res.body.cluster).to.have.all.keys('gaepo', 'seocho')
			expect(res.body.isAdmin).to.be.a('boolean');
		});
	});

	// 체크인
	const cardNO = 9;
	const userID = 302;
	describe((`checkin with no.${cardNO} card`), () => {
		it('success checkin', async () => {
			const res = await server.post(`/user/checkIn/${cardNO}`).set('Cookie', [sessionCookie]);
			expect(res.body.result).to.equal(true);
		});
	});

	// 같은번호로 체크인
	describe((`checkin with no.${cardNO} card again`), () => {
		it('duplicate checkin rejected', async () => {
			const res = await server.post(`/user/checkIn/${cardNO}`).set('Cookie', [sessionCookie]);
			expect(res.status).to.equal(400);
			expect(res.body.code).to.equal(400);
		});
	});

	// 체크인 후, 상태 확인
	describe((`check user status, after checkin`), () => {
		it('user status changed', async () => {
			const res = await server.get(`/user/status`).set('Cookie', [sessionCookie]);
			expect(res.body.user.login).to.equal('yurlee');
			expect(res.body.user.card).to.equal(cardNO);
		});
	});

	// 체크아웃
	describe((`check user status, after checkin`), () => {
		it('checkout success', async () => {
			const res = await server.post(`/user/checkOut`).set('Cookie', [sessionCookie]);
			expect(res.body.result).to.equal(true);
		});
	});

	// 체크인 후, 강제 체크아웃
	describe((`force checkout, after checkin`), () => {
		it('force  checkout success', async () => {
			server.post(`/user/checkIn/${cardNO}`).set('Cookie', [sessionCookie]).then(async(res) => {
				const res2 = await server.post(`/user/forceCheckout/${userID}`).set('Cookie', [sessionCookie]);
				expect(res2.body.result).to.equal(true);
			})
		});
	});

	// 체크인 후, 강제 체크아웃 중복실행
	describe((`duplicated force checkout, after force checkout`), () => {
		it('force checkout failed', async () => {
			const res = await server.post(`/user/forceCheckout/${userID}`).set('Cookie', [sessionCookie]);
			expect(res.status).to.equal(404);
			expect(res.body.code).to.equal(404);
		});
	});
});

/*
card
- 카드 생성
- 사용중인 카드 카운트
- 모든 카드
- 오류 카드 사용해제
- 사용중인 카드 카운트

log
- 카드 로그 보기
- 모든 로그 보기
- 개포에서 사용중인 카드 보기
- 서초에서 사용중인 카드 보기
- 특징 유저의 키드 사용 내역 보기
- 미반납 카드 보기
- 모든 카드 정보 보기

user
- 유저 로그인
- 유저 로그인 콜백
- 체크인 					    DONE
- 유저 상태 					DONE
- 체크아웃화면으로				  DONE
- 강제 체크아웃 				 DONE

config
- 설정값 조회

*/
