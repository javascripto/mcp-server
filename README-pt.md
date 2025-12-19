# MCP TODO Server (Português)

**Português** | [English](./README.md)

Um servidor [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) robusto construído com [NestJS](https://nestjs.com/), projetado para gerenciar tarefas TODO e integrar-se perfeitamente com agentes de IA como Claude Desktop, ChatGPT e ferramentas de automação como n8n.

## 🚀 Funcionalidades

- **✅ Gerenciamento de TODO**: Operações CRUD completas para tarefas.
- **🤖 Integração MCP**: Expõe operações de TODO como ferramentas MCP usando SSE (Server-Sent Events) e Stdio (via CLI).
- **📚 Swagger UI**: Documentação interativa da API em `/api/docs`.
- **🔍 MCP Inspector**: Suporte integrado para ferramentas de depuração com o `@modelcontextprotocol/inspector`.
- **🛠️ Ferramentas Modernas**: Construído com TypeScript, Biome para linting/formatação e Jest para testes E2E.

## 🛠️ Stack Tecnológica

- **Framework**: [NestJS](https://nestjs.com/)
- **Protocolo**: [Model Context Protocol (MCP)](https://modelcontextprotocol.io/)
- **Documentação**: [Swagger/OpenAPI](https://swagger.io/)
- **Linting/Formatação**: [Biome](https://biomejs.dev/)
- **Testes**: [Jest](https://jestjs.io/) & [Supertest](https://github.com/visionmedia/supertest)

## 📋 Pré-requisitos

- [Node.js](https://nodejs.org/) (v18 ou superior)
- [npm](https://www.npmjs.com/)

## ⚙️ Configuração do Projeto

```bash
# Instalar dependências
$ npm install

# Criar arquivo de ambiente
$ cp .env.example .env # Certifique-se de que SERVER_PORT=3000 esteja definido
```

## 🏃 Compilação e Execução

```bash
# Desenvolvimento (modo watch)
$ npm run start:dev

# Modo produção
$ npm run build
$ npm run start:prod
```

## 📖 Documentação da API

Assim que o servidor estiver rodando, você pode acessar a documentação interativa do Swagger em:
`http://localhost:3000/api/docs`

## 🤖 Usando com Clientes MCP

### 1. ChatGPT Desktop (macOS)
1. Vá em **Settings > Advanced** e habilite o **Developer Mode**.
2. Vá em **Settings > Connectors** e clique em **Create**.
3. Defina a URL como `http://localhost:3000/sse` e a Autenticação como **None**.

### 2. MCP Inspector (Depuração)
Para depurar as ferramentas MCP localmente:
```bash
$ npm run inspector
```
Isso abrirá o MCP Inspector em `http://localhost:3000/sse`.

### 3. Claude Desktop
Adicione o seguinte ao seu `claude_desktop_config.json`:
```json
{
  "mcpServers": {
    "mcp-todo": {
      "command": "node",
      "args": ["/caminho/para/o/projeto/dist/main.js"]
    }
  }
}
```

## 🧪 Testes

```bash
# Testes unitários
$ npm run test

# Testes end-to-end
$ npm run test:e2e
```

## 📄 Licença

Este projeto é [UNLICENSED](LICENSE).
