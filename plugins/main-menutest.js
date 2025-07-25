import fetch from 'node-fetch'

let handler = async (m, { conn }) => {
  let userId = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.sender
  let name = await conn.getName(userId)
  let _uptime = process.uptime() * 1000
  let uptime = clockString(_uptime)
  let totalreg = Object.keys(global.db.data.users).length
  let totalCommands = Object.values(global.plugins).filter(v => v.help && v.tags).length

  let menu = `
꒰⑅ᵕ༚ᵕ꒱˖♡  ✧  ˗ˋˏ ʚ♡⃛ɞ ˎˊ˗  ✧  ꕤ

˚₊· ͟͟͞͞➳❥  *Hola ${name}*, soy ʚ ${botname} ɞ

｡･:*˚:✧｡  ╭───────────────────╮ ｡･:*˚:✧｡
⋆˚✿˖°  ❀  ᴍᴏᴅᴏ: Público
⋆˚✿˖°  ❀  ᴀᴄᴛɪᴠᴏ: ${uptime}
⋆˚✿˖°  ❀  ᴜꜱᴜᴀʀɪᴏꜱ: ${totalreg}
⋆˚✿˖°  ❀  ᴄᴏᴍᴀɴᴅᴏꜱ: ${totalCommands}
｡･:*˚:✧｡  ╰───────────────────╯ ｡･:*˚:✧｡
  `.trim()

  // Agrupar comandos por tags
  let groups = {}
  for (let plugin of Object.values(global.plugins)) {
    if (!plugin.tags || !plugin.help) continue
    for (let tag of plugin.tags) {
      if (!groups[tag]) groups[tag] = []
      groups[tag].push(...plugin.help)
    }
  }

  for (let tag in groups) {
    menu += `\n\n✦ ｡°✩ *${tag.toUpperCase()}* ｡°✩ ✦\n`
    for (let cmd of groups[tag]) {
      menu += `𓆩♡𓆪  ${global.prefix[0]}${cmd}\n`
    }
  }

  menu += `\n\n꒰Gracias por usarme ₊˚⊹`

  await conn.sendMessage(m.chat, {
    text: menu,
    contextInfo: {
      mentionedJid: [userId],
      externalAdReply: {
        title: botname,
        body: textbot,
        mediaType: 1,
        mediaUrl: redes,
        sourceUrl: redes,
        thumbnail: await (await fetch(banner)).buffer(),
        renderLargerThumbnail: true
      }
    }
  }, { quoted: m })
}

handler.help = ['menu']
handler.tags = ['main']
handler.command = ['menutest']

export default handler

function clockString(ms) {
  let seconds = Math.floor((ms / 1000) % 60)
  let minutes = Math.floor((ms / (1000 * 60)) % 60)
  let hours = Math.floor((ms / (1000 * 60 * 60)) % 24)
  return `${hours}h ${minutes}m ${seconds}s`
}