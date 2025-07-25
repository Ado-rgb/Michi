import { promises as fs } from 'fs';

const charactersFilePath = './src/database/characters.json';
const haremFilePath = './src/database/harem.json';
const cooldowns = {};

async function loadCharacters() {
  const data = await fs.readFile(charactersFilePath, 'utf-8');
  return JSON.parse(data);
}

async function saveCharacters(data) {
  await fs.writeFile(charactersFilePath, JSON.stringify(data, null, 2), 'utf-8');
}

async function loadHarem() {
  try {
    const data = await fs.readFile(haremFilePath, 'utf-8');
    return JSON.parse(data);
  } catch {
    return {};
  }
}

async function saveHarem(data) {
  await fs.writeFile(haremFilePath, JSON.stringify(data, null, 2), 'utf-8');
}

let handler = async (m, { conn }) => {
  const userId = m.sender;
  const now = Date.now();

  // Chequear cooldown
  if (cooldowns[userId] && now < cooldowns[userId]) {
    const remainingTime = Math.ceil((cooldowns[userId] - now) / 1000);
    const min = Math.floor(remainingTime / 60);
    const sec = remainingTime % 60;
    return await conn.reply(
      m.chat,
      `《✧》Debes esperar *${min} minutos y ${sec} segundos* para volver a usar *#c*`,
      m
    );
  }

  // Verificar que cite mensaje del bot
  if (!m.quoted || m.quoted.sender !== conn.user.jid) {
    return await conn.reply(m.chat, '《✧》Debes citar un personaje válido enviado por el bot.', m);
  }

  // Extraer ID con nuevo formato (sin asteriscos)
  const characterIdMatch = m.quoted.text.match(/ID\s*›\s*(\d+)/i);
  if (!characterIdMatch) {
    return await conn.reply(m.chat, '《✧》No se encontró un ID válido en el mensaje citado.', m);
  }

  const characterId = characterIdMatch[1];

  try {
    const characters = await loadCharacters();
    const harem = await loadHarem();

    const character = characters.find(c => c.id === characterId);
    if (!character) {
      return await conn.reply(m.chat, '《✧》El personaje con ese ID no existe.', m);
    }

    if (character.user && character.user !== userId) {
      return await conn.reply(
        m.chat,
        `《✧》El personaje ya fue reclamado por @${character.user.split('@')[0]}`,
        m,
        { mentions: [character.user] }
      );
    }

    // Reclamar personaje
    character.user = userId;
    character.status = 'Reclamado';

    // Guardar en harem.json
    if (!harem[userId]) harem[userId] = [];
    if (!harem[userId].some(p => p.id === character.id)) {
      harem[userId].push(character);
    }

    // Guardar cambios
    await saveCharacters(characters);
    await saveHarem(harem);

    // Cooldown de 30 minutos
    cooldowns[userId] = now + 30 * 60 * 1000;

    await conn.reply(m.chat, `✦ Has reclamado a *${character.name}* con éxito.`, m);

  } catch (err) {
    console.error(err);
    await conn.reply(m.chat, `✘ Error al reclamar: ${err.message}`, m);
  }
};

handler.help = ['claim'];
handler.tags = ['gacha'];
handler.command = ['c', 'claim', 'reclamar'];
handler.group = true;

export default handler;