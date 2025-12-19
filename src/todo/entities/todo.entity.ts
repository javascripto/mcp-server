import { ApiProperty } from '@nestjs/swagger';

export class Todo {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Buy milk' })
  title: string;

  @ApiProperty({
    example: 'Go to the supermarket and buy milk',
    required: false,
  })
  description?: string;

  @ApiProperty({ example: false })
  completed: boolean;
}
