import express from 'express';
import { readData, writeData } from '../utils/fileHandler.js';

const router = express.Router();

// GET /api/users - Lista todos os usuários
router.get('/', async (req, res) => {
  try {
    const data = await readData();
    
    // Remove senhas da resposta
    const usersWithoutPassword = data.users.map(({ password, ...user }) => user);
    
    res.json(usersWithoutPassword);
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/users/:id - Busca usuário por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = await readData();
    
    const user = data.users.find(u => u.id === parseInt(id));
    
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    
    // Remove senha da resposta
    const { password, ...userWithoutPassword } = user;
    
    res.json(userWithoutPassword);
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// POST /api/users - Cria novo usuário
router.post('/', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    // Validação
    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }
    
    const data = await readData();
    
    // Verifica se email já existe
    const emailExists = data.users.some(u => u.email === email);
    if (emailExists) {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }
    
    // Gera novo ID
    const maxId = Math.max(...data.users.map(u => u.id));
    const newUserId = maxId + 1;
    
    // Cria novo usuário
    const newUser = {
      id: newUserId,
      name,
      email,
      password,
      type: "collaborator",
      role,
      avatar: ""
    };
    
    // Cria tarefas do template
    const taskTemplate = data.templates[role];
    const maxTaskId = Math.max(...data.tasks.map(t => t.id));
    
    const newTasks = taskTemplate.map((template, index) => ({
      id: maxTaskId + index + 1,
      collaborator_id: newUserId,
      template_task_id: template.id,
      title: template.title,
      status: "pending"
    }));
    
    // Adiciona aos dados
    data.users.push(newUser);
    data.tasks.push(...newTasks);
    
    // Salva no arquivo
    await writeData(data);
    
    // Remove senha da resposta
    const { password: _, ...userWithoutPassword } = newUser;
    
    res.status(201).json({
      message: 'Usuário criado com sucesso',
      user: userWithoutPassword,
      tasksCreated: newTasks.length
    });
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

export default router;