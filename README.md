# MCP TODO Server

[Português](./README-pt.md) | **English**

A robust [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) server built with [NestJS](https://nestjs.com/), designed to manage TODO tasks and integrate seamlessly with AI agents like Claude Desktop, ChatGPT, and automation tools like n8n.

## 🚀 Features

- **✅ TODO Management**: Full CRUD operations for tasks.
- **🤖 MCP Integration**: Exposes TODO operations as MCP tools using both SSE (Server-Sent Events) and Stdio (via CLI integration).
- **📚 Swagger UI**: Interactive API documentation at `/api/docs`.
- **🔍 MCP Inspector**: Built-in support for debugging tools with the `@modelcontextprotocol/inspector`.
- **🛠️ Modern Tooling**: Built with TypeScript, Biome for linting/formatting, and Jest for E2E testing.

## 🛠️ Tech Stack

- **Framework**: [NestJS](https://nestjs.com/)
- **Protocol**: [Model Context Protocol (MCP)](https://modelcontextprotocol.io/)
- **Documentation**: [Swagger/OpenAPI](https://swagger.io/)
- **Linting/Formatting**: [Biome](https://biomejs.dev/)
- **Testing**: [Jest](https://jestjs.io/) & [Supertest](https://github.com/visionmedia/supertest)

## 📋 Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/)

## ⚙️ Project Setup

```bash
# Install dependencies
$ npm install

# Create environment file
$ cp .env.example .env # Ensure SERVER_PORT=3000 is set
```

## 🏃 Compilation and Running

```bash
# Development (watch mode)
$ npm run start:dev

# Production mode
$ npm run build
$ npm run start:prod
```

## 📖 API Documentation

Once the server is running, you can access the interactive Swagger documentation at:
`http://localhost:3000/api/docs`

## 🤖 Using with MCP Clients

### 1. ChatGPT Desktop (macOS)
1. Go to **Settings > Advanced** and enable **Developer Mode**.
2. Go to **Settings > Connectors** and click **Create**.
3. Set URL to `http://localhost:3000/sse` and Authentication to **None**.

### 2. MCP Inspector (Debugging)
To debug the MCP tools locally:
```bash
$ npm run inspector
```
This will open the MCP Inspector at `http://localhost:3000/sse`.

### 3. Claude Desktop
Add the following to your `claude_desktop_config.json`:
```json
{
  "mcpServers": {
    "mcp-todo": {
      "command": "node",
      "args": ["/path/to/project/dist/main.js"]
    }
  }
}
```

## 🧪 Testing

```bash
# Unit tests
$ npm run test

# End-to-end tests
$ npm run test:e2e
```

## 📄 License

This project is [UNLICENSED](LICENSE).
