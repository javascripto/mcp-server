import {
  Controller,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  Redirect,
} from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Redirect('/api', HttpStatus.PERMANENT_REDIRECT)
  @HttpCode(HttpStatus.OK)
  redirectToApi() {}

  @Get('hello')
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  @HttpCode(HttpStatus.OK)
  @Header('Cache-Control', 'none')
  getHealth(): { status: string; timestamp: Date } {
    return this.appService.getHealth();
  }
}
