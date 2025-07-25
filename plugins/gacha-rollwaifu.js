import { promises as fs } from 'fs'

const charactersFilePath = './src/database/characters.json'
const haremFilePath = './src/database/harem.json'

const cooldowns = {}

async function loadCharacters() {
  try {
    const data = await fs.readFile(charactersFilePath, 'utf-8')
    return JSON.parse(data)
  } catch (e) {
    throw new Error('❀ No se pudo cargar characters.json.')
  }
}

async function loadHarem() {
  try {
    const data = await fs.readFile(haremFilePath, 'utf-8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

let handler = async (m, { conn }) => {
  const userId = m.sender
  const now = Date.now()

  if (cooldowns[userId] && now < cooldowns[userId]) {
    const rem = Math.ceil((cooldowns[userId] - now) / 1000)
    const min = Math.floor(rem / 60)
    const sec = rem % 60
    return conn.reply(m.chat, `ꕥ Espera *${min}m ${sec}s* para tirar roll otra vez`, m)
  }

  try {
    const characters = await loadCharacters()
    const harem = await loadHarem()

    // Tirar 1 random personaje
    const randomChar = characters[Math.floor(Math.random() * characters.length)]

    // Buscar si está en harem y quién lo tiene
    const userEntry = harem.find(h => h.characterId === randomChar.id)
    const estado = userEntry ? `Reclamado por @${userEntry.userId.split('@')[0]}` : 'Libre'

    // Mensaje tipo lista similar al ejemplo que pusiste
    let msg = `ꕥ Personaje \n\n`

    msg += `✩ 𝙉𝙤𝙢𝙗𝙧𝙚 › *${randomChar.name}*\n`
    msg += `✩ 𝙂é𝙣𝙚𝙧𝙤 › *${randomChar.gender}*\n`
    msg += `✩ 𝙑𝙖𝙡𝙤𝙧  › *${randomChar.value}*\n`
    msg += `✩ 𝙀𝙨𝙩𝙖𝙙𝙤 › *${estado}*\n`
    msg += `✩ 𝙁𝙪𝙚𝙣𝙩𝙚 › *${randomChar.source}*\n`
    msg += `✩ 𝙄𝘿    › *${randomChar.id}*\n\n`

    msg += `> Reclama con *c*\n`
    msg += `> Para tirar otra vez › *#rw*\n`

    const mentions = userEntry ? [userEntry.userId] : []
    await conn.sendFile(m.chat, randomChar.img[0], `${randomChar.name}.jpg`, msg, m, { mentions })

    cooldowns[userId] = now + 15 * 60 * 1000
  } catch (e) {
    await conn.reply(m.chat, `❌ Error al cargar personaje: ${e.message}`, m)
  }
}

handler.help = ['rollwaifu', 'rw', 'ver']
handler.tags = ['gacha']
handler.command = ['rollwaifu', 'rw', 'ver']
handler.group = true

export default handler