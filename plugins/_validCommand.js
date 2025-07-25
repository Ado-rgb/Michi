export async function before(m) {
  if (!m.text || !global.prefix.test(m.text)) return

  const usedPrefix = global.prefix.exec(m.text)[0]
  const command = m.text.slice(usedPrefix.length).trim().split(' ')[0].toLowerCase()

  const validCommand = (command, plugins) => {
    for (let plugin of Object.values(plugins)) {
      if (plugin.command && (Array.isArray(plugin.command) ? plugin.command : [plugin.command]).includes(command)) {
        return true
      }
    }
    return false
  }

  if (!command) return
  if (command === "bot") return

  if (validCommand(command, global.plugins)) {
    let chat = global.db.data.chats[m.chat]
    let user = global.db.data.users[m.sender]
    if (chat.isBanned) {
      const avisoDesactivado = `《✦》El bot *${botname}* está desactivado en este grupo.\n\n> ✦ Un *administrador* puede activarlo con:\n» *${usedPrefix}bot on*`
      await m.reply(avisoDesactivado)
      return
    }
    if (!user.commands) user.commands = 0
    user.commands += 1
  } else {
    const comando = m.text.trim().split(' ')[0]
    const botname = global.botname || "Michino Ai"
    const redes = "https://chat.whatsapp.com/LVswMhDLIzbAf4WliK6nau"

    await m.conn.sendMessage(m.chat, {
      text: `✖ El comando *${comando}* no existe o está fuera de servicio.\n\n💡 *Tip:* Usa \`${usedPrefix}help\` para ver la lista de comandos disponibles.`,
      contextInfo: {
        externalAdReply: {
          title: botname,
          body: `No encontré el comando ${comando}, prueba con ${usedPrefix}help`,
          mediaType: 1,
          mediaUrl: redes,
          sourceUrl: redes,
          showAdAttribution: false,
          containsAutoReply: true
        }
      }
    }, { quoted: m })
  }
}