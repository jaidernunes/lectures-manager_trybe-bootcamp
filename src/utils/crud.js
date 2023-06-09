const fs = require('fs').promises;

async function readDB() {
  try {
    const talkersJSON = await fs.readFile('src/talker.json', 'utf-8');
    const talkers = JSON.parse(talkersJSON);
    return talkers;
  } catch (err) {
    console.error(err.message);
  }
}

async function writeDB(data) {
  try {
    const json = JSON.stringify(data);
    await fs.writeFile('src/talker.json', json);
  } catch (err) {
    console.error(err.message);
  }
}

module.exports = {
  readDB,
  writeDB,
};