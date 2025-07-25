export async function before(m) {
  if (!m.text) return
  if (!global.prefix.test(m.text)) return

  const prefixMatch = global.prefix.exec(m.text)
  if (!prefixMatch) return

  const usedPrefix = prefixMatch[0]
  const command = m.text.slice(usedPrefix.length).trim().split(' ')[0].toLowerCase()
  if (!command) return
  if (command === 'bot') return

  const validCommand = (cmd, plugins) => {
    if (!plugins || typeof plugins !== 'object') return false
    for (let plugin of Object.values(plugins)) {
      if (!plugin.command) continue
      let cmds = Array.isArray(plugin.command) ? plugin.command : [plugin.command]
      if (cmds.map(c => c.toLowerCase()).includes(cmd)) return true
    }
    return false
  }

  if (validCommand(command, global.plugins)) {
    let chat = global.db.data.chats[m.chat] || {}
    let user = global.db.data.users[m.sender] || {}

    if (chat.isBanned) {
      const avisoDesactivado = `《✦》El bot *${botname}* está desactivado en este grupo.\n\n> ✦ Un *administrador* puede activarlo con:\n» *${usedPrefix}bot on*`
      await m.reply(avisoDesactivado)
      return
    }

    if (!user.commands) user.commands = 0
    user.commands += 1
    global.db.data.users[m.sender] = user
  } else {
    const comando = m.text.trim().split(' ')[0]
    await m.reply(
      `✖ El comando *${comando}* no existe o está fuera de servicio.\n\n💡 *Tip:* Usa \`${usedPrefix}help\` para ver la lista de comandos disponibles.`,
      m
    )
  }
}