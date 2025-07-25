import fetch from 'node-fetch'

const orderedTags = [
  'main',
  'nable',
  'tools',
  'ai',
  'fun',
  'anime',
  'buscador',
  'descargas',
  'dl',
  '+18',
  'transformador',
  'downloader',
  'gacha',
  'game',
  'games',
  'group',
  'grupo',
  'owner',
  'info',
  'serbot',
  'nsfw',
  'emox',
  'mods',
  'rg',
  'rpg',
  'economia',
  'economy',
  'sticker',
  'herramientas',
]

let handler = async (m, { conn }) => {
  let name = m.pushName || m.sender.split('@')[0]
  let prefix = (global.prefix && global.prefix[0]) ? global.prefix[0] : '.'

  // detectar si es bot principal o subbot
  let tipoBot = conn.user?.id?.split(':')[0] === global.conn?.user?.id?.split(':')[0] 
    ? '*BOT PRINCIPAL*'
    : '*SUBBOT*'

  let menu = `> Hola @${name}, Soy *${global.botname}*\n`
  menu += `${tipoBot}\n\n`

  // agrupar comandos por tags
  let groups = {}
  for (let plugin of Object.values(global.plugins)) {
    if (!plugin.tags || !plugin.help) continue
    for (let tag of plugin.tags) {
      if (!groups[tag]) groups[tag] = []
      groups[tag].push(...plugin.help.filter(cmd => typeof cmd === 'string'))
    }
  }

  // construir menú decorado con tags ordenados
  for (let tag of orderedTags) {
    if (!groups[tag] || !groups[tag].length) continue
    menu += `╭─⋆˚✿˖° ❀ *${tag.toUpperCase()}* ❀ ⋆˚✿˖°─╮\n`
    for (let cmd of groups[tag]) {
      menu += `│ ꕥ › *${prefix}${cmd}*\n`
    }
    menu += `╰───────────────────╯\n`
  }

  // enviar con externalAdReply y como reenviado muchas veces
  await conn.sendMessage(m.chat, { 
    text: menu,
    contextInfo: {
      mentionedJid: [m.sender],
      forwardingScore: 999,
      isForwarded: true,
      externalAdReply: {                
        title: global.botname,
        body: global.textbot,
        mediaType: 1,
        mediaUrl: global.redes,
        sourceUrl: global.redes,
        thumbnail: await (await fetch(global.banner)).buffer(),
        showAdAttribution: false,
        containsAutoReply: true,
        renderLargerThumbnail: true
      }
    }
  }, { quoted: m })
}

handler.help = ['menu']
handler.tags = ['main']
handler.command = ['menu', 'help', 'menú']

export default handler