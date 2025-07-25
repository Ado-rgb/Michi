import { totalmem, freemem } from 'os'
import { sizeFormatter } from 'human-readable'
import speed from 'performance-now'

const format = sizeFormatter({ std: 'JEDEC', decimalPlaces: 2, keepTrailingZeroes: false, render: (literal, symbol) => `${literal} ${symbol}B` })

var handler = async (m, { conn }) => {
  let timestamp = speed()
  let latensi = speed() - timestamp

  let _muptime = process.uptime() * 1000
  let muptime = clockString(_muptime)

  let chats = Object.entries(conn.chats).filter(([id, data]) => id && data.isChats)
  let groups = Object.entries(conn.chats).filter(([jid, chat]) => jid.endsWith('@g.us') && chat.isChats && !chat.metadata?.read_only && !chat.metadata?.announce).map(v => v[0])

  let texto = `
❀ *Estado del Bot*

➪ *Velocidad ›* ${latensi.toFixed(4)} ms
> 🕒 *Activo ›* ${muptime}
> 💬 *Chats privados ›* ${chats.length}
> 👥 *Grupos activos ›* ${groups.length}
> 🏆 *RAM en uso ›* ${format(totalmem() - freemem())} / ${format(totalmem())}

© mᥲძᥱ ᥕі𝗍һ ᑲᥡ *Ado, Yosue*
`.trim()

  await m.react('✈️')
  await conn.reply(m.chat, texto, m)
}

handler.help = ['speed']
handler.tags = ['info']
handler.command = ['speed']
handler.register = true

export default handler

function clockString(ms) {
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => v.toString().pad