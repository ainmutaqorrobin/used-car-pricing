import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Authentication System', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('handles signup request', () => {
    const enteredEmail = 'test@gmail.com';
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: enteredEmail, password: 'test' })
      .expect(201)
      .then((res) => {
        const { id, email } = res.body;
        expect(id).toBeDefined();
        expect(email).toEqual(enteredEmail);
      });
  });

  it('signup new user and get current logged user', async () => {
    const enteredEmail = 'test123@gmail.com';

    const response = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: enteredEmail, password: 'test' })
      .expect(201);

    const cookie = response.get('Set-Cookie');

    const { body } = await request(app.getHttpServer())
      .get('/auth/whoamI')
      .set('Cookie', cookie)
      .expect(200);
    expect(body.email).toEqual(enteredEmail);
  });
});
