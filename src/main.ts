import { AppModule } from '@/app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const mcpServerRoutes = ['sse', 'mcp', 'messages'];
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors();
  app.disable('x-powered-by');
  app.setGlobalPrefix('api', { exclude: ['', 'hello', ...mcpServerRoutes] });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: false,
    }),
  );
  const openAPIConfig = new DocumentBuilder()
    .setTitle('MCP TODO API')
    .setDescription('The MCP TODO API description')
    .setVersion('1.0')
    .addTag('todo')
    .build();
  const documentFactory = () =>
    SwaggerModule.createDocument(app, openAPIConfig);
  SwaggerModule.setup('api/docs', app, documentFactory);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('SERVER_PORT') || 3000;
  if (process.env.NODE_ENV !== 'production') await app.listen(port);
  return app.getHttpAdapter().getInstance();
}

export default bootstrap();
