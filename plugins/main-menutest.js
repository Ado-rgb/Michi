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

  let menu = `> Hola @${name}, bienvenido/a al menú de *${global.botname}*\n\n`

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

  // enviar con externalAdReply
  await conn.sendMessage(m.chat, { 
    text: menu,
    contextInfo: {
      mentionedJid: [m.sender],
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