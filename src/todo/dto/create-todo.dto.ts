import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateTodoDto {
  @ApiProperty({
    description: 'The title of the TODO item',
    minLength: 3,
    example: 'Buy milk',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  title: string;

  @ApiProperty({
    description: 'A detailed description of the TODO item',
    required: false,
    example: 'Go to the supermarket and buy 2 liters of milk',
  })
  @IsString()
  @IsOptional()
  description?: string;
}
