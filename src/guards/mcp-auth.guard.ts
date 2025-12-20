import { McpExecutionContext } from '@nestjs-mcp/server';
import { CanActivate, Injectable, Logger } from '@nestjs/common';

interface RequestHandlerExtra {
  sessionId?: string;
  headers?: Record<string, string | string[] | undefined>;
}

@Injectable()
export class McpAuthGuard implements CanActivate {
  private readonly logger = new Logger(McpAuthGuard.name);

  canActivate(context: McpExecutionContext): boolean {
    // Pegar os argumentos do handler - o último é sempre RequestHandlerExtra
    const args = context.getArgs<unknown[]>();
    const extra = args[args.length - 1] as RequestHandlerExtra | undefined;

    // Debug log
    this.logger.log(`MCP Auth Guard: Args count: ${args.length}`);
    this.logger.log(`MCP Auth Guard: Extra: ${JSON.stringify(extra)}`);

    if (!extra?.headers) {
      this.logger.warn('MCP Auth Guard: No headers available in context');
      return false;
    }

    const authHeader = extra.headers.authorization as string | undefined;
    this.logger.log(`MCP Auth Guard: Auth header: ${authHeader}`);

    if (!authHeader?.startsWith('Bearer ')) {
      this.logger.warn('MCP Auth Guard: Missing or invalid Bearer token');
      return false;
    }

    const token = authHeader.split(' ')[1];
    const expectedToken = process.env.MCP_AUTH_TOKEN;

    if (!expectedToken) {
      this.logger.error(
        'MCP Auth Guard: MCP_AUTH_TOKEN not configured in environment',
      );
      return false;
    }

    if (token !== expectedToken) {
      this.logger.warn('MCP Auth Guard: Invalid token');
      return false;
    }

    this.logger.log('MCP Auth Guard: Access granted');
    return true;
  }
}
