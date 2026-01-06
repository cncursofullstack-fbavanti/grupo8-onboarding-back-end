import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Resolve o caminho do arquivo data.json
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DATA_PATH = join(__dirname, '../data/data.json');

// Lê os dados do arquivo
export const readData = async () => {
  try {
    const data = await fs.readFile(DATA_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Erro ao ler data.json:', error);
    throw error;
  }
};

// Escreve os dados no arquivo
export const writeData = async (data) => {
  try {
    await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Erro ao escrever em data.json:', error);
    throw error;
  }
};