import { McpAuthGuard } from '@/guards/mcp-auth.guard';
import { Resolver, Tool, UseGuards } from '@nestjs-mcp/server';
import { z } from 'zod';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { TodoService } from './todo.service';

@Resolver()
export class TodoResolver {
  constructor(private readonly todoService: TodoService) {}

  @Tool({
    name: 'todo_create',
    description: 'Create a new TODO item',
    paramsSchema: {
      title: z.string().min(3).describe('The title of the todo item'),
      description: z.string().optional().describe('Optional description'),
    },
  })
  async create(createTodoDto: CreateTodoDto) {
    const todo = this.todoService.create(createTodoDto);
    return {
      content: [
        { type: 'text', text: `Created TODO: ${JSON.stringify(todo)}` },
      ],
    };
  }

  @Tool({
    name: 'todo_list',
    description: 'List all TODO items',
  })
  async findAll() {
    const todos = this.todoService.findAll();
    return {
      content: [{ type: 'text', text: JSON.stringify(todos, null, 2) }],
    };
  }

  @Tool({
    name: 'todo_get',
    description: 'Get a specific TODO item by ID',
    paramsSchema: {
      id: z.number().describe('The ID of the todo item'),
    },
  })
  async findOne({ id }: { id: number }) {
    const todo = this.todoService.findOne(id);
    return {
      content: [{ type: 'text', text: JSON.stringify(todo, null, 2) }],
    };
  }

  @Tool({
    name: 'todo_update',
    description: 'Update an existing TODO item',
    paramsSchema: {
      id: z.number().describe('The ID of the todo item to update'),
      title: z.string().optional().describe('New title'),
      description: z.string().optional().describe('New description'),
      completed: z.boolean().optional().describe('Completion status'),
    },
  })
  async update({ id, ...updateTodoDto }: UpdateTodoDto & { id: number }) {
    const todo = this.todoService.update(id, updateTodoDto);
    return {
      content: [
        { type: 'text', text: `Updated TODO: ${JSON.stringify(todo)}` },
      ],
    };
  }

  @UseGuards(McpAuthGuard)
  @Tool({
    name: 'todo_delete',
    description: 'Delete a TODO item',
    paramsSchema: {
      id: z.number().describe('The ID of the todo item to delete'),
    },
  })
  async remove({ id }: { id: number }) {
    this.todoService.remove(id);
    return {
      content: [
        { type: 'text', text: `Successfully deleted TODO with ID ${id}` },
      ],
    };
  }
}
