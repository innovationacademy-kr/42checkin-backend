import request from 'supertest';
import { app } from '../../../src/app';
import { describe, it, before } from 'mocha';
import { expect } from 'chai';
import httpStatus from 'http-status';
import { CLUSTER_CODE } from '../../../src/modules/cluster';
import { sessionCookie } from '../env';
import { sequelize } from '../../../src/models';

describe('card api test', async () => {
	before((done) => {
        try {
            sequelize.authenticate().then(() => {
                app.on('dbconnected', () => {
                    done();
                });
            })
        } catch(e) {
            console.log(e);
        }
	});

	describe((`사용중인 카드리스트 조회`), () => {
		it('객체로된 배열 형태의 데이터를 반환하는가?', async () => {
			const res = await request(app).get(`/card/usingCard`).set('Cookie', [sessionCookie]);
			expect(res.body).to.an('array');
			if (res.body.length) {
				expect(res.body[0]).to.have.keys('type', 'cardId', 'using', 'createdAt', 'updatedAt', 'deletedAt')
			}
		});
	});

	describe((`클러스터별 체크인 카운트 조회`), () => {
		it('클러스터별 카운트를 반환하는가?', async () => {
			const res = await request(app).get(`/card/using`).set('Cookie', [sessionCookie]);
			expect(res.body).to.have.all.keys('seocho', 'gaepo')
			expect(res.body.seocho).to.a('number');
			expect(res.body.gaepo).to.a('number');
		});
	});

	describe((`카드 정보 생성`), () => {
		it('쿼리로 전달된 값. (end - start)개만큼 생성', async () => {
			const res = await request(app)
				.post(`/card/create/${CLUSTER_CODE.gaepo}`)
				.query({ start: 1, end: 2 })
				.set('Cookie', [sessionCookie]);
			expect(res.body.result).to.true
		});
	});

	describe((`카드 정보 생성 실패케이스 - 쿼리오류`), () => {
		it('쿼리가 전달되지 않으면 에러가 발생하는가?', async () => {
			const res = await request(app)
				.post(`/card/create/${CLUSTER_CODE.gaepo}`)
				.set('Cookie', [sessionCookie]);
			expect(res.body.code).to.equal(httpStatus.BAD_REQUEST);
		});
	});

	describe((`카드 정보 생성 실패케이스 - 클러스터 코드 오류`), () => {
		it('존재하지 않는 클러스터의 코드로 전달하면 오류가 발생하는가?', async () => {
			const res = await request(app)
				.post(`/card/create/${123}`)
				.query({ start: 1, end: 2 })
				.set('Cookie', [sessionCookie]);
			expect(res.body.code).to.equal(httpStatus.BAD_REQUEST);
		});
	});
});
