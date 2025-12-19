import { McpModule } from '@nestjs-mcp/server';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TodoModule } from './todo/todo.module';

@Module({
  imports: [
    TodoModule,
    ConfigModule.forRoot(),
    McpModule.forRoot({
      name: 'TodoMCP',
      version: '1.0.0',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
