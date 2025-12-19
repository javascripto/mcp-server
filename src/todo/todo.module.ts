import { Module } from '@nestjs/common';
import { TodoController } from './todo.controller';
import { TodoResolver } from './todo.resolver';
import { TodoService } from './todo.service';

@Module({
  controllers: [TodoController],
  providers: [TodoService, TodoResolver],
})
export class TodoModule {}
