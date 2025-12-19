import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './entities/todo.entity';
import { TodoService } from './todo.service';

@ApiTags('todo')
@Controller('todo')
@ApiResponse({ status: 500, description: 'Internal server error' })
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new TODO' })
  @ApiResponse({
    status: 201,
    description: 'The TODO has been successfully created.',
    type: Todo,
  })
  create(@Body() createTodoDto: CreateTodoDto): Todo {
    return this.todoService.create(createTodoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all TODOs' })
  @ApiResponse({
    status: 200,
    description: 'Return all TODOs.',
    type: [Todo],
  })
  findAll(): Todo[] {
    return this.todoService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a TODO by id' })
  @ApiResponse({
    status: 200,
    description: 'Return the TODO.',
    type: Todo,
  })
  @ApiResponse({ status: 404, description: 'TODO not found' })
  findOne(@Param('id', ParseIntPipe) id: number): Todo {
    return this.todoService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a TODO' })
  @ApiResponse({
    status: 200,
    description: 'The TODO has been successfully updated.',
    type: Todo,
  })
  @ApiResponse({ status: 404, description: 'TODO not found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTodoDto: UpdateTodoDto,
  ): Todo {
    return this.todoService.update(id, updateTodoDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a TODO' })
  @ApiResponse({
    status: 200,
    description: 'The TODO has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'TODO not found' })
  remove(@Param('id', ParseIntPipe) id: number): void {
    this.todoService.remove(id);
  }
}
