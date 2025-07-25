let handler = async (m, { conn }) => {
  let name = m.pushName || m.sender.split('@')[0] // evitar null
  let prefix = (global.prefix && global.prefix[0]) ? global.prefix[0] : '.' // evitar undefined

  let menu = `> _Hola @${name}, bienvenido/a al menú de *Mai* ꕤ_\n\n`

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
    menu += `╰────────────────────────╯\n`
  }

  // enviar con imagen global.banner
  await conn.sendMessage(m.chat, {
    image: { url: global.banner }, // asegúrate de definir global.banner
    caption: menu,
    mentions: [m.sender]
  })
}

handler.help = ['menu']
handler.tags = ['main']
handler.command = ['menuts']

export default handler