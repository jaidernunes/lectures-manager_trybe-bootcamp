const express = require('express');
const crypto = require('crypto');

const { readDB } = require('./utils/crud');

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

app.post('/login', async (req, res) => {
  // const { email } = req.body;
  // const { password } = req.body;
  const randomToken = crypto.randomBytes(8).toString('hex');
  console.log(randomToken);

  return res.status(200).json({
    token: randomToken,
  });
  });  
