const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Configuração Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Middleware
app.use(cors({
  origin: [
    'https://marvelous-manatee-00afc2.netlify.app',
    'http://localhost:8000', 
    'http://127.0.0.1:5500', 
    'http://localhost:3000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

// Rota para buscar todas as práticas
app.get('/api/practices', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('practices')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({
      success: true,
      count: data.length,
      data: data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar práticas: ' + error.message
    });
  }
});

// Rota para criar nova prática
app.post('/api/practices', async (req, res) => {
  try {
    const { name, management, practice, date } = req.body;

    if (!name || !management || !practice || !date) {
      return res.status(400).json({
        success: false,
        message: 'Todos os campos são obrigatórios'
      });
    }

    const { data, error } = await supabase
      .from('practices')
      .insert([
        {
          name,
          management,
          practice,
          date
        }
      ])
      .select();

    if (error) throw error;

    res.status(201).json({
      success: true,
      message: 'Boa prática cadastrada com sucesso!',
      data: data[0]
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Erro ao cadastrar prática: ' + error.message
    });
  }
});

// Rota para EXCLUIR prática - ADICIONAR ESTA ROTA
app.delete('/api/practices/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log('Tentando excluir prática ID:', id);

    const { error } = await supabase
      .from('practices')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao excluir:', error);
      return res.status(400).json({
        success: false,
        message: 'Erro ao excluir prática: ' + error.message
      });
    }

    res.json({
      success: true,
      message: 'Prática excluída com sucesso!'
    });
  } catch (error) {
    console.error('Erro geral ao excluir:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao excluir prática: ' + error.message
    });
  }
});

// Rota para buscar práticas
app.get('/api/practices/search/:term', async (req, res) => {
  try {
    const { term } = req.params;

    const { data, error } = await supabase
      .from('practices')
      .select('*')
      .or(`name.ilike.%${term}%,management.ilike.%${term}%,practice.ilike.%${term}%`)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({
      success: true,
      count: data.length,
      data: data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro na busca: ' + error.message
    });
  }
});

// Rota para estatísticas
app.get('/api/practices/stats/summary', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('practices')
      .select('*');

    if (error) throw error;

    const totalPractices = data.length;
    const uniqueUsers = [...new Set(data.map(p => p.name))].length;
    const uniqueManagements = [...new Set(data.map(p => p.management))].length;

    res.json({
      success: true,
      data: {
        totalPractices,
        uniqueUsers,
        uniqueManagements
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar estatísticas: ' + error.message
    });
  }
});

// Rota raiz
app.get('/', (req, res) => {
  res.json({ 
    message: '🏛️ API do Banco de Boas Práticas - STC MA (Supabase)',
    status: 'Online ✅',
    version: '2.0.0',
    database: 'Supabase PostgreSQL'
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📊 Supabase conectado!`);
});

