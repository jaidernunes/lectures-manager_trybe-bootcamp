const express = require('express');
const crypto = require('crypto');

const { readDB } = require('./utils/crud');
const { loginValidator } = require('./middlewares/validators');

const app = express();
app.use(express.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});

app.get('/talker', async (req, res) => {
  const response = await readDB();
  if (!response) return res.status(200).json([]);
  return res.status(200).json(response);
  });

app.get('/talker/:id', async (req, res) => {
  const { id } = req.params;
  const response = await readDB();
  if (!response || id >= 4 || id <= 0) {
    return res.status(404).json({
    message: 'Pessoa palestrante não encontrada',
  }); 
  }
  return res.status(200).json(response[id - 1]);
  });

app.post('/login', loginValidator, async (req, res) => {
  const randomToken = crypto.randomBytes(8).toString('hex');
  // const { password, email } = req.body;
  // const validEmail = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;
  // if (!email) {
  //   return res.status(400).json({ message: 'O campo "email" é obrigatório' });
  // }
  // if (!validEmail.test(email)) {
  //   return res.status(400).json({ message: 'O "email" deve ter o formato "email@email.com"' });
  // }
  // if (!password) {
  //   return res.status(400).json({ message: 'O campo "password" é obrigatório' });
  // }
  // if (password.length < 6) {
  //   return res.status(400).json({ message: 'O "password" deve ter pelo menos 6 caracteres' });
  // }
  return res.status(200).json({
    token: randomToken,
  });
  });  
