import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { CreateTodoDto } from './create-todo.dto';

export class UpdateTodoDto extends PartialType(CreateTodoDto) {
  @ApiProperty({
    description: 'Whether the TODO item is completed',
    required: false,
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  completed?: boolean;
}
