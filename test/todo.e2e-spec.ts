import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('TodoController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: false,
      }),
    );
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/api/todo (POST)', () => {
    return request(app.getHttpServer())
      .post('/api/todo')
      .send({ title: 'E2E Todo' })
      .expect(201)
      .expect(res => {
        expect(res.body.title).toBe('E2E Todo');
        expect(res.body.id).toBeDefined();
      });
  });

  it('/api/todo (GET)', async () => {
    await request(app.getHttpServer())
      .post('/api/todo')
      .send({ title: 'Todo 1' });
    return request(app.getHttpServer())
      .get('/api/todo')
      .expect(200)
      .expect(res => {
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
      });
  });

  it('/api/todo/:id (GET)', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/todo')
      .send({ title: 'Todo 1' });
    const id = res.body.id;
    return request(app.getHttpServer())
      .get(`/api/todo/${id}`)
      .expect(200)
      .expect(res => {
        expect(res.body.id).toBe(id);
      });
  });

  it('/api/todo/:id (PATCH)', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/todo')
      .send({ title: 'Todo 1' });
    const id = res.body.id;
    return request(app.getHttpServer())
      .patch(`/api/todo/${id}`)
      .send({ completed: true })
      .expect(200)
      .expect(res => {
        expect(res.body.completed).toBe(true);
      });
  });

  it('/api/todo/:id (DELETE)', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/todo')
      .send({ title: 'Todo 1' });
    const id = res.body.id;
    await request(app.getHttpServer()).delete(`/api/todo/${id}`).expect(200);
    return request(app.getHttpServer()).get(`/api/todo/${id}`).expect(404);
  });

  describe('Validation', () => {
    it('should return 400 for invalid title', () => {
      return request(app.getHttpServer())
        .post('/api/todo')
        .send({ title: 'ab' }) // Too short
        .expect(400);
    });

    it('should return 400 for empty title', () => {
      return request(app.getHttpServer())
        .post('/api/todo')
        .send({ title: '' }) // Empty
        .expect(400);
    });

    it('should return 400 for invalid completed type', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/todo')
        .send({ title: 'Valid Title' });
      const id = res.body.id;
      return request(app.getHttpServer())
        .patch(`/api/todo/${id}`)
        .send({ completed: 'not a boolean' })
        .expect(400);
    });
  });
});
