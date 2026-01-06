import express from 'express';
import { readData } from '../utils/fileHandler.js';

const router = express.Router();

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validação básica
    if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    // Busca usuário
    const data = await readData();
    const user = data.users.find(u => u.email === email && u.password === password);

    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // Remove senha da resposta
    const { password: _, ...userWithoutPassword } = user;

    res.json({ 
      message: 'Login realizado com sucesso',
      user: userWithoutPassword 
    });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

export default router;