# Sistema de Onboarding - Backend

API REST para gerenciamento do processo de onboarding de colaboradores em empresas de TI.

## 📋 Sobre o Projeto

Backend do sistema desenvolvido como trabalho final do curso de Fullstack, responsável por gerenciar dados de colaboradores, tarefas de onboarding e autenticação de usuários.

## 🎯 Funcionalidades da API

### Autenticação
- Login de usuários (gestor e colaborador)
- Validação de credenciais

### Gestão de Colaboradores
- Cadastro de novos colaboradores
- Listagem de colaboradores
- Busca de colaborador por ID
- Aplicação automática de templates por papel

### Gestão de Tarefas
- Listagem de tarefas por colaborador
- Atualização de status de tarefas
- Adição de tarefas customizadas
- Templates de tarefas por papel (Dev, QA, PO)

## 🛠️ Tecnologias Utilizadas

- Node.js
- Express
- File System (fs) - Manipulação de JSON
- CORS - Integração com frontend

## 🗂️ Estrutura de Dados (JSON)

### data.json

```json
{
  "usuarios": [
    {
      "id": 1,
      "nome": "Admin",
      "email": "admin@empresa.com",
      "senha": "admin123",
      "tipo": "gestor"
    }
  ],
  "colaboradores": [
    {
      "id": 1,
      "nome": "João Silva",
      "email": "joao@empresa.com",
      "senha": "senha123",
      "papel": "dev",
      "tipo": "colaborador"
    }
  ],
  "templates": [
    {
      "papel": "dev",
      "tarefas": [
        {
          "id": 1,
          "titulo": "Configurar conta do Git",
          "descricao": "Criar conta e configurar SSH keys"
        }
      ]
    }
  ],
  "tarefas_colaborador": [
    {
      "id": 1,
      "colaborador_id": 1,
      "tarefa_id": 1,
      "titulo": "Configurar conta do Git",
      "descricao": "Criar conta e configurar SSH keys",
      "status": "pendente",
      "is_template": true
    }
  ]
}
```

## 🚀 Como Executar

```bash
# Instalar dependências
npm install

# Executar servidor em desenvolvimento
npm run dev

# Executar servidor em produção
npm start
```

O servidor estará disponível em `http://localhost:3000`

## 📡 Endpoints da API

### Autenticação

**POST /api/login**
- Body: `{ "email": "string", "senha": "string" }`
- Retorna: dados do usuário autenticado

### Colaboradores

**GET /api/colaboradores**
- Retorna: lista de todos os colaboradores

**GET /api/colaboradores/:id**
- Retorna: dados de um colaborador específico

**POST /api/colaboradores**
- Body: `{ "nome": "string", "email": "string", "senha": "string", "papel": "dev|qa|po" }`
- Retorna: colaborador criado com tarefas do template aplicadas

### Tarefas

**GET /api/tarefas/:colaborador_id**
- Retorna: todas as tarefas de um colaborador

**PATCH /api/tarefas/:id**
- Body: `{ "status": "pendente|concluido" }`
- Retorna: tarefa atualizada

**POST /api/tarefas**
- Body: `{ "colaborador_id": number, "titulo": "string", "descricao": "string" }`
- Retorna: tarefa customizada criada

### Templates

**GET /api/templates/:papel**
- Retorna: template de tarefas para o papel especificado

## 📦 Estrutura do Projeto

```
backend/
├── data/
│   └── data.json
├── routes/
│   ├── auth.js
│   ├── colaboradores.js
│   └── tarefas.js
├── utils/
│   └── fileHandler.js
├── server.js
├── package.json
└── README.md
```

## 📝 Regras de Negócio

1. Ao cadastrar colaborador, o sistema copia automaticamente o template de tarefas do papel selecionado
2. Tarefas do template não podem ser editadas ou removidas (flag `is_template: true`)
3. Gestor pode adicionar tarefas customizadas (`is_template: false`)
4. Status de tarefas: `pendente` ou `concluido`
5. Cada colaborador tem acesso apenas às próprias tarefas
6. Autenticação simples sem criptografia (ambiente acadêmico)

## 🔒 Segurança

⚠️ **Atenção**: Este projeto utiliza autenticação simplificada para fins educacionais. Em produção, seria necessário:
- Criptografia de senhas (bcrypt)
- Tokens JWT para sessões
- Validação de inputs
- Rate limiting
- HTTPS

## 🎓 Contexto Acadêmico

Projeto desenvolvido como avaliação final do curso de Fullstack, aplicando os conhecimentos de:
- Criação de APIs REST com Node.js
- Manipulação de dados em JSON
- Estruturação de rotas e endpoints
- Integração com frontend

---

**Desenvolvido como projeto final do curso de Fullstack**