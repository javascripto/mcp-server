import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './entities/todo.entity';

@Injectable()
export class TodoService {
  private todos: Todo[] = [];
  private nextId = 1;

  create(createTodoDto: CreateTodoDto): Todo {
    const todo: Todo = {
      id: this.nextId++,
      ...createTodoDto,
      completed: false,
    };
    this.todos.push(todo);
    return todo;
  }

  findAll(): Todo[] {
    return this.todos;
  }

  findOne(id: number): Todo {
    const todo = this.todos.find(t => t.id === id);
    if (!todo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }
    return todo;
  }

  update(id: number, updateTodoDto: UpdateTodoDto): Todo {
    const todoIndex = this.todos.findIndex(t => t.id === id);
    if (todoIndex === -1) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }

    const updatedTodo = {
      ...this.todos[todoIndex],
      ...updateTodoDto,
    };
    this.todos[todoIndex] = updatedTodo;
    return updatedTodo;
  }

  remove(id: number): void {
    const todoIndex = this.todos.findIndex(t => t.id === id);
    if (todoIndex === -1) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }
    this.todos.splice(todoIndex, 1);
  }
}
