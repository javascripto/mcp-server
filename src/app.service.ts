import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getHealth(): { status: string; timestamp: Date } {
    return {
      status: 'OK',
      timestamp: new Date(),
    };
  }
}
