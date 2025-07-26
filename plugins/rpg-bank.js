import db from '../lib/database.js'

let handler = async (m, { conn, usedPrefix }) => {
  let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : m.sender
  if (who == conn.user.jid) return m.react('✖️')
  if (!(who in global.db.data.users)) return m.reply(`❌ Ese usuario ni figura en la base de datos w`)

  let user = global.db.data.users[who]
  let total = (user.coin || 0) + (user.bank || 0)

  const texto = `❀ *Información de Balance*\n
➪ *Usuario ›* ${conn.getName(who)}\n> ⛁ Dinero › *${user.coin} ${moneda}*\n> ⚿ Banco › *${user.bank} ${moneda}*\n> ☁︎ Total › *${total} ${moneda}*\n
> *Tip ›* Guarda tu feria en el banco usando *${usedPrefix}deposit* antes que te la vuelen alv 💸`

  await conn.reply(m.chat, texto, m)
}

handler.help = ['bal']
handler.tags = ['economy']
handler.command = ['bal', 'balance', 'bank']
handler.register = true
handler.group = true

export default handler