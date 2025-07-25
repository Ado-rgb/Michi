let handler = async (m, { conn, text }) => {
  if (!text) throw 'Debes enviar el ID del grupo, ejemplo:\n.delprimary @120363402280020652@g.us'
  const chatId = text.trim()

  if (!global.db.data.chats[chatId]) return m.reply('Ese grupo no está registrado en la base de datos.')

  if (!global.db.data.chats[chatId].primaryBot) return m.reply('Ese grupo no tiene bot principal configurado.')

  delete global.db.data.chats[chatId].primaryBot

  m.reply(`Se eliminó el bot principal del grupo:\n${chatId}`)
}

handler.help = ['delprimary <idgrupo>']
handler.tags = ['owner']
handler.command = ['delprimary']

export default handler