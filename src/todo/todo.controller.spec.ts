import { TodoController } from '@/todo/todo.controller';
import { TodoService } from '@/todo/todo.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('TodoController', () => {
  let controller: TodoController;
  let service: TodoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodoController],
      providers: [
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

    controller = module.get<TodoController>(TodoController);
    service = module.get<TodoService>(TodoService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create', () => {
      const dto = { title: 'New Todo' };
      controller.create(dto);
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should call service.findAll', () => {
      controller.findAll();
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should call service.findOne', () => {
      controller.findOne(1);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should call service.update', () => {
      const dto = { title: 'Updated' };
      controller.update(1, dto);
      expect(service.update).toHaveBeenCalledWith(1, dto);
    });
  });

  describe('remove', () => {
    it('should call service.remove', () => {
      controller.remove(1);
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});
