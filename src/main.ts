import { AppModule } from '@/app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors();
  const mcpServerRoutes = ['sse', 'mcp', 'messages'];
  app.setGlobalPrefix('api', { exclude: ['', 'hello', ...mcpServerRoutes] });
  app.disable('x-powered-by');
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: false,
    }),
  );
  const configService = app.get(ConfigService);
  await app.listen(configService.getOrThrow<number>('SERVER_PORT'));
}
bootstrap();
