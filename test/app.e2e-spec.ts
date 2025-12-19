import { AppModule } from '@/app.module';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { App } from 'supertest/types';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api', { exclude: ['', 'hello'] });
    await app.init();
  });

  it('/ (GET) - Redirect to /api', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(HttpStatus.PERMANENT_REDIRECT)
      .expect(res => {
        expect(res.headers.location).toBe('/api');
      });
  });

  it('/hello (GET) - Hello World!', () => {
    return request(app.getHttpServer())
      .get('/hello')
      .expect(200)
      .expect('Hello World!');
  });

  it('/health (GET) - Health check', () => {
    return request(app.getHttpServer())
      .get('/api/health')
      .expect(200)
      .expect(res => {
        expect(res.body).toEqual({
          status: 'OK',
          timestamp: expect.any(String),
        });
      });
  });
});
