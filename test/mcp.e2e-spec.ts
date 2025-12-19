import * as http from 'node:http';
import { AppModule } from '@/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

jest.setTimeout(30000);

describe('MCP Server (e2e)', () => {
  type Server = ReturnType<INestApplication['getHttpServer']>;
  let app: INestApplication;
  let server: Server;
  let sseRequest: http.ClientRequest;
  let sseResponse: http.IncomingMessage;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    const mcpServerRoutes = ['sse', 'mcp', 'messages'];
    app.setGlobalPrefix('api', { exclude: ['', 'hello', ...mcpServerRoutes] });

    app.useGlobalPipes(new ValidationPipe({ transform: true }));

    await app.listen(0);
    server = app.getHttpServer();
  });

  afterAll(async () => {
    if (sseRequest) {
      sseRequest.destroy();
    }
    if (app) {
      await app.close();
    }
  });

  // Função para esperar por uma mensagem específica no stream SSE
  const waitForSSEResponse = (
    id: number | string,
  ): Promise<ReturnType<typeof JSON.parse>> => {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(
        () => reject(new Error(`Timeout waiting for SSE response id: ${id}`)),
        5000,
      );

      const onData = (chunk: Buffer) => {
        const lines = chunk.toString().split('\n');
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const content = JSON.parse(line.replace('data: ', ''));
              if (content.id === id) {
                sseResponse.removeListener('data', onData);
                clearTimeout(timeout);
                resolve(content);
              }
            } catch (e) {
              // Not JSON or partial chunk, ignore
            }
          }
        }
      };

      sseResponse.on('data', onData);
    });
  };

  it('should initialize and execute tools via SSE events', async () => {
    const addr = server.address();
    const port = typeof addr === 'string' ? 3000 : addr.port;

    // 1. Abrir conexão SSE e obter sessionId
    const sessionId = await new Promise<string>(resolve => {
      sseRequest = http.get(`http://localhost:${port}/sse`, res => {
        sseResponse = res;
        let buffer = '';
        res.on('data', chunk => {
          buffer += chunk.toString();
          const match = buffer.match(/sessionId=([a-zA-Z0-9-]+)/);
          if (match) resolve(match[1]);
        });
      });
    });

    expect(sessionId).toBeDefined();

    // 2. Chamar Initialize (Envia POST e espera o evento no SSE)
    await request(server)
      .post(`/messages?sessionId=${sessionId}`)
      .send({
        jsonrpc: '2.0',
        id: 1,
        method: 'initialize',
        params: {
          protocolVersion: '2024-11-05',
          capabilities: {},
          clientInfo: { name: 'test', version: '1.0' },
        },
      })
      .expect(202);

    const initResult = await waitForSSEResponse(1);
    expect(initResult.result.protocolVersion).toBeDefined();

    // 3. List Tools
    await request(server)
      .post(`/messages?sessionId=${sessionId}`)
      .send({
        jsonrpc: '2.0',
        id: 2,
        method: 'tools/list',
        params: {},
      })
      .expect(202);

    const listResult = await waitForSSEResponse(2);
    expect(
      listResult.result.tools.some(
        (t: Awaited<ReturnType<typeof waitForSSEResponse>>) =>
          t.name === 'todo_list',
      ),
    ).toBe(true);

    // 4. Call Tool (create)
    await request(server)
      .post(`/messages?sessionId=${sessionId}`)
      .send({
        jsonrpc: '2.0',
        id: 3,
        method: 'tools/call',
        params: {
          name: 'todo_create',
          arguments: { title: 'E2E Async' },
        },
      })
      .expect(202);

    const callResult = await waitForSSEResponse(3);
    expect(callResult.result.content[0].text).toContain('E2E Async');
  });
});
