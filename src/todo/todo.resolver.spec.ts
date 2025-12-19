import { TodoResolver } from '@/todo/todo.resolver';
import { TodoService } from '@/todo/todo.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('TodoResolver', () => {
  let resolver: TodoResolver;
  let service: TodoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodoResolver,
        {
          provide: TodoService,
          useValue: {
            create: jest
              .fn()
              .mockImplementation(dto => ({ id: 1, ...dto, completed: false })),
            findAll: jest.fn().mockReturnValue([]),
            findOne: jest
              .fn()
              .mockImplementation(id => ({ id, title: 'Test' })),
            update: jest.fn().mockImplementation((id, dto) => ({ id, ...dto })),
            remove: jest.fn().mockReturnValue(undefined),
          },
        },
      ],
    }).compile();

    resolver = module.get<TodoResolver>(TodoResolver);
    service = module.get<TodoService>(TodoService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create and return MCP formatted content', async () => {
      const dto = { title: 'New Todo' };
      const result = await resolver.create(dto);

      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toHaveProperty('content');
      expect(result.content[0].type).toBe('text');
      expect(result.content[0].text).toContain('New Todo');
    });
  });

  describe('findAll', () => {
    it('should return all todos in MCP format', async () => {
      const result = await resolver.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toHaveProperty('content');
      expect(result.content[0].text).toBe('[]');
    });
  });

  describe('findOne', () => {
    it('should return a specific todo in MCP format', async () => {
      const result = await resolver.findOne({ id: 1 });

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toHaveProperty('content');
      expect(JSON.parse(result.content[0].text)).toHaveProperty('id', 1);
    });
  });

  describe('update', () => {
    it('should update todo and return MCP format', async () => {
      const dto = { title: 'Updated', id: 1 };
      const result = await resolver.update(dto);

      expect(service.update).toHaveBeenCalledWith(1, { title: 'Updated' });
      expect(result).toHaveProperty('content');
      expect(result.content[0].text).toContain('Updated');
    });
  });

  describe('remove', () => {
    it('should delete todo and return confirmation message', async () => {
      const result = await resolver.remove({ id: 1 });

      expect(service.remove).toHaveBeenCalledWith(1);
      expect(result).toHaveProperty('content');
      expect(result.content[0].text).toContain('deleted TODO with ID 1');
    });
  });
});
