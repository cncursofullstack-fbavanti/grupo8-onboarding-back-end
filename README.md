# Sistema de Onboarding - Backend

API REST para gerenciamento do processo de onboarding de colaboradores em empresas de TI.

## 📋 Sobre o Projeto

Backend do sistema desenvolvido como trabalho final do curso de Fullstack, responsável por gerenciar dados de colaboradores, tarefas de onboarding e autenticação de usuários através de uma API REST.

## 🎯 Funcionalidades da API

### Autenticação
- Login de usuários (gestor e colaborador)
- Validação de credenciais
- Retorno de dados do usuário autenticado

### Gestão de Colaboradores
- Listagem de todos os usuários
- Busca de colaborador por ID
- Cadastro de novos colaboradores
- Validação de email duplicado
- Aplicação automática de templates de tarefas por papel

### Gestão de Tarefas
- Listagem de todas as tarefas
- Filtro de tarefas por colaborador
- Busca de tarefa por ID
- Atualização de status de tarefas (pending/completed)
- Busca de templates por papel (dev, qa, po)

### Templates
- Templates pré-definidos por papel
- 7 tarefas específicas para cada papel (Dev, QA, PO)
- Aplicação automática no cadastro de colaboradores

## 🛠️ Tecnologias Utilizadas

- Node.js
- Express 4
- File System (fs/promises) - Manipulação de JSON
- CORS - Integração com frontend
- ES6 Modules (import/export)

## 🚀 Como Executar

### Pré-requisitos
- Node.js instalado (versão 16+)

### Instalação

```bash
# Clonar o repositório
git clone [url-do-repositorio]
cd backend

# Instalar dependências
npm install

# Executar em modo de desenvolvimento (com auto-reload)
npm run dev

# Executar em modo de produção
npm start
```

O servidor estará disponível em `http://localhost:3000`

## 📦 Estrutura do Projeto

```
backend/
├── src/
│   ├── routes/
│   │   ├── auth.js          # Rotas de autenticação
│   │   ├── users.js         # Rotas de usuários
│   │   └── tasks.js         # Rotas de tarefas
│   ├── utils/
│   │   └── fileHandler.js   # Funções de leitura/escrita JSON
│   ├── data/
│   │   └── data.json        # Banco de dados (arquivo JSON)
│   └── server.js            # Configuração do servidor Express
├── api-tests.http           # Testes da API (REST Client)
├── package.json
└── README.md
```

## 🗂️ Estrutura de Dados (data.json)

### Users
```json
{
  "id": 1,
  "name": "Professor X",
  "email": "xavier.charles@xmen.com",
  "password": "icanreadyourmind",
  "type": "manager",
  "avatar": "/src/assets/imgs/professor.png"
}
```

**Campos:**
- `id` (number) - Identificador único
- `name` (string) - Nome completo
- `email` (string) - Email único
- `password` (string) - Senha (texto simples - ambiente acadêmico)
- `type` (string) - "manager" ou "collaborator"
- `role` (string, opcional) - "dev", "qa" ou "po" (apenas para collaborators)
- `avatar` (string) - URL da imagem

### Tasks
```json
{
  "id": 1,
  "collaborator_id": 2,
  "template_task_id": 1,
  "title": "Configurar conta do Git e SSH keys",
  "status": "completed"
}
```

**Campos:**
- `id` (number) - Identificador único
- `collaborator_id` (number) - ID do colaborador
- `template_task_id` (number) - ID da tarefa no template
- `title` (string) - Descrição da tarefa
- `status` (string) - "pending" ou "completed"

### Templates
```json
{
  "dev": [
    { "id": 1, "title": "Configurar conta do Git e SSH keys" },
    ...
  ],
  "qa": [...],
  "po": [...]
}
```

## 📡 Endpoints da API

### Autenticação

**POST /api/auth/login**
```json
// Request
{
  "email": "xavier.charles@xmen.com",
  "password": "icanreadyourmind"
}

// Response 200
{
  "message": "Login realizado com sucesso",
  "user": {
    "id": 1,
    "name": "Professor X",
    "email": "xavier.charles@xmen.com",
    "type": "manager",
    "avatar": "..."
  }
}

// Response 401
{
  "error": "Credenciais inválidas"
}
```

### Usuários

**GET /api/users**
- Retorna todos os usuários (sem senhas)
- Response 200: Array de usuários

**GET /api/users/:id**
- Retorna um usuário específico (sem senha)
- Response 200: Objeto do usuário
- Response 404: `{ "error": "Usuário não encontrado" }`

**POST /api/users**
```json
// Request
{
  "name": "Wolverine",
  "email": "logan@xmen.com",
  "password": "snikt123",
  "role": "dev"
}

// Response 201
{
  "message": "Usuário criado com sucesso",
  "user": { ... },
  "tasksCreated": 7
}

// Response 400
{
  "error": "Email já cadastrado"
}
```

### Tarefas

**GET /api/tasks**
- Retorna todas as tarefas
- Query param opcional: `?collaborator_id=2` (filtra por colaborador)
- Response 200: Array de tarefas

**GET /api/tasks/:id**
- Retorna uma tarefa específica
- Response 200: Objeto da tarefa
- Response 404: `{ "error": "Tarefa não encontrada" }`

**PATCH /api/tasks/:id**
```json
// Request
{
  "status": "completed"
}

// Response 200
{
  "message": "Tarefa atualizada com sucesso",
  "task": { ... }
}

// Response 400
{
  "error": "Status deve ser \"pending\" ou \"completed\""
}
```

**GET /api/tasks/templates/:role**
- Retorna template de tarefas para um papel
- Parâmetros: `dev`, `qa` ou `po`
- Response 200: Array de tarefas do template
- Response 404: `{ "error": "Template não encontrado" }`

## 🧪 Testando a API

### Opção 1: REST Client (VSCode Extension)

Instale a extensão "REST Client" no VSCode e use o arquivo `api-tests.http`:

```http
### Login - Gestor
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "xavier.charles@xmen.com",
  "password": "icanreadyourmind"
}

### Listar usuários
GET http://localhost:3000/api/users

### Criar colaborador
POST http://localhost:3000/api/users
Content-Type: application/json

{
  "name": "Wolverine",
  "email": "logan@xmen.com",
  "password": "snikt123",
  "role": "dev"
}
```

### Opção 2: cURL

```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"xavier.charles@xmen.com","password":"icanreadyourmind"}'

# Listar usuários
curl http://localhost:3000/api/users

# Criar colaborador
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Wolverine","email":"logan@xmen.com","password":"snikt123","role":"dev"}'
```

### Opção 3: Postman/Insomnia

Importe a collection ou configure manualmente os endpoints acima.

## 📝 Regras de Negócio

1. Email deve ser único no sistema
2. Ao cadastrar colaborador, template de tarefas é aplicado automaticamente
3. Templates contêm 7 tarefas específicas por papel
4. Senhas são armazenadas em texto simples (ambiente acadêmico)
5. Usuários podem ser do tipo "manager" ou "collaborator"
6. Tarefas podem ter status "pending" ou "completed"
7. IDs são gerados automaticamente de forma incremental
8. Dados persistem em arquivo JSON (data.json)

## 🔄 Fluxo de Dados

```
Request → Express Routes → FileHandler → data.json
                ↓
            Response
```

1. Cliente faz requisição HTTP
2. Express roteia para handler apropriado
3. Handler usa fileHandler para ler/escrever JSON
4. Dados são processados e validados
5. Response é enviado ao cliente
6. Mudanças são persistidas em data.json

## 🔒 Segurança

### Implementado
- Validação de inputs básica
- Verificação de email duplicado
- CORS habilitado para integração com frontend
- Remoção de senhas nas respostas da API

### ⚠️ Limitações (Ambiente Acadêmico)
- Senhas armazenadas em texto simples (produção: bcrypt)
- Sem autenticação via tokens (produção: JWT)
- Sem validação robusta de inputs
- Sem rate limiting
- Sem HTTPS

**Para produção seria necessário:**
- Hash de senhas com bcrypt
- JWT para autenticação stateless
- Validação de inputs com bibliotecas como Joi/Zod
- Banco de dados real (PostgreSQL, MongoDB)
- Rate limiting e proteção contra ataques
- HTTPS obrigatório

## 🐛 Tratamento de Erros

A API retorna códigos HTTP apropriados:

- **200** - Sucesso
- **201** - Recurso criado com sucesso
- **400** - Bad Request (dados inválidos)
- **401** - Unauthorized (credenciais inválidas)
- **404** - Not Found (recurso não encontrado)
- **500** - Internal Server Error (erro no servidor)

Formato de erro padrão:
```json
{
  "error": "Mensagem descritiva do erro"
}
```

## 📊 Dados Iniciais (Seed Data)

O sistema vem com dados pré-cadastrados para testes:

**Usuários:**
- 1 Gestor (Professor X)
- 5 Colaboradores (Cyclops, Phoenix, Beast, Iceman, Storm)

**Tarefas:**
- 28 tarefas distribuídas entre os colaboradores
- Diferentes níveis de progresso (0% a 100%)

**Templates:**
- 7 tarefas para Dev
- 7 tarefas para QA
- 7 tarefas para PO

## 🔧 Scripts Disponíveis

```json
{
  "start": "node src/server.js",
  "dev": "nodemon src/server.js"
}
```

- `npm start` - Executa servidor em produção
- `npm run dev` - Executa com auto-reload (desenvolvimento)

## 📝 Middleware

### CORS
Configurado para aceitar requisições de qualquer origem (desenvolvimento).

```javascript
app.use(cors());
```

### JSON Parser
Processa body das requisições em JSON.

```javascript
app.use(express.json());
```

## 🗃️ Persistência de Dados

Os dados são armazenados em `src/data/data.json` e persistem entre reinicializações do servidor.

**Vantagens:**
- Simples e direto
- Não requer configuração de banco de dados
- Fácil visualização e edição manual dos dados

**Limitações:**
- Não escalável para produção
- Sem controle de concorrência
- Risco de corrupção do arquivo
- Performance limitada com muitos dados

## 🎓 Contexto Acadêmico

Projeto desenvolvido como avaliação final do curso de Fullstack, aplicando os conhecimentos de:
- Criação de APIs REST com Node.js e Express
- Manipulação de dados em JSON com File System
- Estruturação de rotas e endpoints RESTful
- Validação de dados e tratamento de erros
- CORS e integração frontend-backend
- Organização de código em módulos ES6
- Uso de async/await para operações assíncronas

## 📚 Aprendizados Técnicos

- Arquitetura RESTful
- Padrões de organização de código backend
- Manipulação de arquivos com Node.js
- Validação e sanitização de dados
- Códigos de status HTTP apropriados
- Tratamento de erros assíncronos
- CRUD completo (Create, Read, Update, Delete)
- Relacionamento entre entidades (Users ↔ Tasks)

## 🔗 Integração com Frontend

Este backend foi desenvolvido para ser consumido pelo frontend React do sistema.

**Repositório do Frontend:** [link-do-repo-frontend]

**Como integrar:**
1. Inicie o backend: `npm run dev`
2. Inicie o frontend em outro terminal
3. Frontend consumirá API em `http://localhost:3000/api`

## 📞 Endpoints de Teste Rápido

```bash
# Verificar se API está rodando
curl http://localhost:3000

# Login rápido
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"xavier.charles@xmen.com","password":"icanreadyourmind"}'

# Listar usuários
curl http://localhost:3000/api/users

# Listar tarefas
curl http://localhost:3000/api/tasks
```

---

**Desenvolvido como projeto final do curso de Fullstack Essencial Atlântico Avanti - FB Uni**