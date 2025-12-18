import { TodoService } from '@/todo/todo.service';
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

describe('TodoService', () => {
  let service: TodoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TodoService],
    }).compile();

    service = module.get<TodoService>(TodoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new todo', () => {
      const dto = { title: 'Test Todo', description: 'Test Description' };
      const todo = service.create(dto);
      expect(todo).toEqual({
        id: 1,
        ...dto,
        completed: false,
      });
      expect(service.findAll()).toHaveLength(1);
    });
  });

  describe('findAll', () => {
    it('should return an empty array initially', () => {
      expect(service.findAll()).toEqual([]);
    });

    it('should return all todos', () => {
      service.create({ title: 'Todo 1' });
      service.create({ title: 'Todo 2' });
      expect(service.findAll()).toHaveLength(2);
    });
  });

  describe('findOne', () => {
    it('should return a todo if it exists', () => {
      const created = service.create({ title: 'Test' });
      const found = service.findOne(created.id);
      expect(found).toEqual(created);
    });

    it('should throw NotFoundException if todo does not exist', () => {
      expect(() => service.findOne(999)).toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a todo', () => {
      const created = service.create({ title: 'Before' });
      const updated = service.update(created.id, {
        title: 'After',
        completed: true,
      });
      expect(updated.title).toBe('After');
      expect(updated.completed).toBe(true);
    });

    it('should throw NotFoundException if todo to update does not exist', () => {
      expect(() => service.update(999, { title: 'No' })).toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove a todo', () => {
      const created = service.create({ title: 'To Delete' });
      service.remove(created.id);
      expect(service.findAll()).toHaveLength(0);
    });

    it('should throw NotFoundException if todo to remove does not exist', () => {
      expect(() => service.remove(999)).toThrow(NotFoundException);
    });
  });
});
