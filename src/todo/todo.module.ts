import { McpAuthGuard } from '@/guards/mcp-auth.guard';
import { McpModule } from '@nestjs-mcp/server';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TodoController } from './todo.controller';
import { TodoResolver } from './todo.resolver';
import { TodoService } from './todo.service';

@Module({
  imports: [ConfigModule, McpModule.forFeature()],
  controllers: [TodoController],
  providers: [TodoService, TodoResolver, McpAuthGuard, ConfigService],
})
export class TodoModule {}
