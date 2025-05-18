// Importando o módulo Express
const express = require('express');

// Criando uma instância do aplicativo Express
const app = express();

// Definindo a porta onde o servidor irá escutar
const PORT = process.env.PORT || 3000;

// Rota principal que retorna "Olá, Mundo!"
app.get('/', (req, res) => {
  res.send('Olá, Mundo!');
});

// Iniciando o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
