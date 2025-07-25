// handler para el menú decorado y agrupado por tags
let handler = async (m, { conn }) => {
  let menu = `> _Hola @${m.pushName}, bienvenido/a al menú de *Mai* ꕤ_\n\n`

  // agrupar comandos por tags
  let groups = {}
  for (let plugin of Object.values(global.plugins)) {
    if (!plugin.tags || !plugin.help) continue
    for (let tag of plugin.tags) {
      if (!groups[tag]) groups[tag] = []
      groups[tag].push(...plugin.help)
    }
  }

  // construir menú decorado
  for (let tag in groups) {
    menu += `╭─⋆˚✿˖° ❀ *${tag.toUpperCase()}* ❀ ⋆˚✿˖°─╮\n`
    for (let cmd of groups[tag]) {
      menu += `│ ꕥ Comando › *${global.prefix[0]}${cmd}*\n`
    }
    menu += `╰────────────────────────╯\n`
  }

  // enviar mensaje
  await conn.reply(m.chat, menu, m, { mentions: [m.sender] })
}

handler.help = ['menu']
handler.tags = ['main']
handler.command = ['menuts']

export default handler