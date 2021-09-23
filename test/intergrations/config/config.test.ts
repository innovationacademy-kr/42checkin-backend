import request from 'supertest';
import { app } from '../../../src/app';
import { describe, it, before } from 'mocha';
import { expect } from 'chai';
import { sequelize } from '../../../src/models';
import { getTimeFormat } from '../../../src/modules/util';
import { getCookie } from '../env';

let cookie = '';

describe('config api test', async () => {
	before(async () => {
        try {
            await sequelize.authenticate();
            cookie = await getCookie();
        } catch(e) {
            console.log(e);
        }
	});

	describe((`설정 테이블의 값을 조회`), () => {
		it('현재 환경의 이름값으로 값을 조회합니다.', async () => {
            const YYYYMMDD = getTimeFormat(new Date(), 'YYYY-MM-DD');
            const query = { date: YYYYMMDD };
			const res = await request(app).get(`/config`).query(query).set('Cookie', [cookie]);
			expect(res.body.gaepo).to.be.a('number')
			expect(res.body.begin_at).to.be.a('string')
            expect(res.body.end_at).to.be.a('string')
			expect(res.body.env).to.be.a('string')
		});
	});

	describe((`설정 테이블의 값을 수정`), () => {
		it('특정 날짜를 선택하여 최대입장 인원수를 수정하고 다시 되돌립니다.', async () => {
            const YYYYMMDD = getTimeFormat(new Date(), 'YYYY-MM-DD');
            const query = { date: YYYYMMDD };
            const { body: { gaepo: oldGaepoCnt } } = await request(app).get(`/config`).query(query).set('Cookie', [cookie]);
            const maxCnt = 200;
            const body = {
                env: {
                    gaepo: maxCnt,
                },
                date: YYYYMMDD
            };
			const res = await request(app).put(`/config`).send(body).set('Cookie', [cookie]);
            expect(res.body.gaepo).eq(maxCnt);
            expect(res.body.seocho).to.be.a('number')
            expect(res.body.begin_at).to.be.a('string')
            expect(res.body.end_at).to.be.a('string')
			expect(res.body.env).to.be.a('string')
            body.env.gaepo = oldGaepoCnt;
			await request(app).put(`/config`).send(body).set('Cookie', [cookie]);
		});

		it('특정 날짜를 선택하여 입장가능 시간을 수정하고 다시 되돌립니다.', async () => {
            const YYYYMMDD = getTimeFormat(new Date(), 'YYYY-MM-DD');
            const query = { date: YYYYMMDD };
            const { body: { begin_at: oldBegin_at } } = await request(app).get(`/config`).query(query).set('Cookie', [cookie]);
            const date = new Date();
            const body = {
                env: {
                    begin_at: date,
                },
                date: YYYYMMDD
            };
			const res = await request(app).put(`/config`).send(body).set('Cookie', [cookie]);
            expect(res.body.begin_at).eq(date.toISOString());
            expect(res.body.seocho).to.be.a('number')
            expect(res.body.begin_at).to.be.a('string')
            expect(res.body.end_at).to.be.a('string')
			expect(res.body.env).to.be.a('string')
            body.env.begin_at = oldBegin_at;
			await request(app).put(`/config`).send(body).set('Cookie', [cookie]);
		});
	});
});
