const express = require('express');
const crypto = require('crypto');

const { readDB, writeDB } = require('./utils/crud');
const { loginValidator,
  tokenValidator,
  nameValidator,
  ageValidator,
  talkValidator,
  watchedAtValidator,
  rateValidator } = require('./middlewares/validators');

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
  return res.status(200).json({
    token: randomToken,
  });
  });

  app.post('/talker', 
  tokenValidator,
  nameValidator,
  ageValidator,
  talkValidator,
  watchedAtValidator,
  rateValidator, async (req, res) => {
    const talkersDB = await readDB();
    const addTalker = { ...req.body, id: talkersDB.length + 1 };
    const updatedDB = [...talkersDB, addTalker];
    writeDB(updatedDB);
    return res.status(201).json(addTalker);
  });

  app.put('/talker/:id', 
  tokenValidator,
  nameValidator,
  ageValidator,
  talkValidator,
  watchedAtValidator,
  rateValidator, async (req, res) => {
    const { id } = req.params;
    const { name, age, talk: { watchedAt, rate } } = req.body;
    const talkersDB = await readDB();
    const updateTalker = { age, name, talk: { watchedAt, rate }, id: Number(id) };
    // const updateTalker = { ...req.body, id: Number(id) };
    const indexId = talkersDB.findIndex((talker) => talker.id === id);
    talkersDB[indexId] = updateTalker;
    // const updatedDB = [...talkersDB, addTalker];
    await writeDB(talkersDB);
    return res.status(200).json(talkersDB[indexId]);
  });
