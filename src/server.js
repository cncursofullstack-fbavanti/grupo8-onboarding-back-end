import express from 'express';
import cors from 'cors';
import { readData } from './utils/fileHandler.js';
import authRoutes from './routes/auth.js';
import usersRoutes from './routes/users.js';

const app = express();
const PORT = 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rota de teste
app.get('/', (req, res) => {
  res.json({ message: 'API Onboarding funcionando!' });
});

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);

app.get('/test', async (req, res) => {
  try {
    const data = await readData();
    res.json({ 
      message: 'Dados carregados com sucesso!',
      totalUsers: data.users.length,
      totalTasks: data.tasks.length
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao ler dados' });
  }
});

// Inicia servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});