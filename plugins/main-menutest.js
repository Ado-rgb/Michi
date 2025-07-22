import fetch from 'node-fetch'
import { xpRange } from '../lib/levelling.js'

let handler = async (m, { conn, usedPrefix: _p }) => {
  try {
    let userId = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.sender
    let user = global.db.data.users[userId]
    let name = await conn.getName(userId)
    let _uptime = process.uptime() * 1000
    let uptime = clockString(_uptime)
    let totalreg = Object.keys(global.db.data.users).length
    let totalCommands = Object.values(global.plugins).filter((v) => v.help && v.tags && !v.disabled).length
    let isPrincipal = (conn.user?.id || '').split(':')[0].replace(/\D/g, '') === '50494547493'
    let botType = isPrincipal ? 'Principal 🅥' : 'Sub Bot 🅑'
    let moneda = global.db.data.settings.moneda || '💰'
    let mode = global.opts['self'] ? 'Privado' : 'Público'
    let ping = Math.floor(conn.ws.ping)

    // Tags y nombres para secciones
    let tags = {
      'main': 'ℹ️ Información',
      'search': '🔍 Búsquedas',
      'downloader': '📥 Descargas',
      'economy': '💰 Economía',
      'gacha': '🎁 Gacha',
      'sticker': '🏞 Stickers',
      'tools': '🛠 Herramientas',
      'profile': '👤 Perfil',
      'group': '👥 Grupos',
      'anime': '🌸 Anime',
      'nsfw': '🔞 NSFW',
      'game': '🎮 Juegos'
    }

    let help = Object.values(global.plugins)
      .filter(plugin => !plugin.disabled)
      .map(plugin => {
        return {
          help: Array.isArray(plugin.help) ? plugin.help : [plugin.help],
          tags: Array.isArray(plugin.tags) ? plugin.tags : [plugin.tags],
          prefix: 'customPrefix' in plugin
        }
      })

    let menuText = `Hola! Soy *${botname}* (｡•̀ᴗ-)✧
Aquí tienes la lista de comandos
╭┈ ↷
│ᰔᩚ Cliente » @${userId.split('@')[0]}
│❀ Modo » ${mode}
│✦ Bot » ${botType}
│ⴵ Activado » ${uptime}
│✰ Usuarios » ${totalreg}
│✧ Comandos » ${totalCommands}
│⏱ Ping » ${ping}ms
│🜸 Baileys » Multi Device
╰─────────────────

• :･ﾟ⊹˚• 『 Comandos 』 •˚⊹:･ﾟ•
`

    for (let tag of Object.keys(tags)) {
      let comandos = help.filter(menu => menu.tags && menu.tags.includes(tag) && menu.help)
        .map(menu => menu.help.map(cmd => `${_p}${cmd}`).join('\n')).join('\n')

      if (comandos.trim()) {
        menuText += `\n*${tags[tag]}*\n${comandos}\n`
      }
    }

    await conn.sendMessage(m.chat, {
      text: menuText,
      mentions: [userId],
      contextInfo: {
        mentionedJid: [userId],
        externalAdReply: {
          title: botname,
          body: textbot,
          mediaType: 1,
          mediaUrl: redes,
          sourceUrl: redes,
          thumbnail: await (await fetch(banner)).buffer(),
          showAdAttribution: false,
          containsAutoReply: true,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: m })

  } catch (e) {
    conn.reply(m.chat, 'Lo sentimos, ocurrió un error generando el menú.', m)
    throw e
  }
}

handler.help = ['menu']
handler.tags = ['main']
handler.command = ['menuts']

export default handler

function clockString(ms) {
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  return `${h}h ${m}m ${s}s`
}