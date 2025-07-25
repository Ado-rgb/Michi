import fetch from 'node-fetch'

let handler = async (m, { conn }) => {
  let name = m.pushName || m.sender.split('@')[0] // evitar null
  let prefix = (global.prefix && global.prefix[0]) ? global.prefix[0] : '.'

  let menu = `> Hola @${name}, bienvenido/a al menú de *${botname}*\n\n`

  // agrupar comandos por tags
  let groups = {}
  for (let plugin of Object.values(global.plugins)) {
    if (!plugin.tags || !plugin.help) continue
    for (let tag of plugin.tags) {
      if (!groups[tag]) groups[tag] = []
      groups[tag].push(...plugin.help.filter(cmd => typeof cmd === 'string'))
    }
  }

  // construir menú decorado
  for (let tag in groups) {
    if (!groups[tag].length) continue
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
        title: botname,
        body: textbot,
        mediaType: 1,
        mediaUrl: redes,
        thumbnail: await (await fetch(banner)).buffer(),
        showAdAttribution: false,
        containsAutoReply: true,
        renderLargerThumbnail: true
      }
    }
  }, { quoted: m })
}

handler.help = ['menu']
handler.tags = ['main']
handler.command = ['menuts']

export default handler