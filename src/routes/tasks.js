import express from 'express';
import { readData, writeData } from '../utils/fileHandler.js';

const router = express.Router();

// GET /api/tasks - Lista todas as tarefas (ou filtra por collaborator_id)
router.get('/', async (req, res) => {
  try {
    const { collaborator_id } = req.query;
    const data = await readData();
    
    let tasks = data.tasks;
    
    // Filtra por colaborador se fornecido
    if (collaborator_id) {
      tasks = tasks.filter(t => t.collaborator_id === parseInt(collaborator_id));
    }
    
    res.json(tasks);
  } catch (error) {
    console.error('Erro ao listar tarefas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/tasks/:id - Busca tarefa por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = await readData();
    
    const task = data.tasks.find(t => t.id === parseInt(id));
    
    if (!task) {
      return res.status(404).json({ error: 'Tarefa não encontrada' });
    }
    
    res.json(task);
  } catch (error) {
    console.error('Erro ao buscar tarefa:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// PATCH /api/tasks/:id - Atualiza status da tarefa
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    // Validação
    if (!status || !['pending', 'completed'].includes(status)) {
      return res.status(400).json({ error: 'Status deve ser "pending" ou "completed"' });
    }
    
    const data = await readData();
    
    // Busca tarefa
    const taskIndex = data.tasks.findIndex(t => t.id === parseInt(id));
    
    if (taskIndex === -1) {
      return res.status(404).json({ error: 'Tarefa não encontrada' });
    }
    
    // Atualiza status
    data.tasks[taskIndex].status = status;
    
    // Salva
    await writeData(data);
    
    res.json({
      message: 'Tarefa atualizada com sucesso',
      task: data.tasks[taskIndex]
    });
  } catch (error) {
    console.error('Erro ao atualizar tarefa:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/tasks/templates/:role - Busca template por papel
router.get('/templates/:role', async (req, res) => {
  try {
    const { role } = req.params;
    const data = await readData();
    
    const template = data.templates[role];
    
    if (!template) {
      return res.status(404).json({ error: 'Template não encontrado' });
    }
    
    res.json(template);
  } catch (error) {
    console.error('Erro ao buscar template:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

export default router;