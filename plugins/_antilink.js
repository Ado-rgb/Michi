const groupLinkRegex = /chat.whatsapp.com\/(?:invite\/)?([0-9A-Za-z]{20,24})/i
const channelLinkRegex = /whatsapp.com\/channel\/([0-9A-Za-z]+)/i

export async function before(m, { conn, isAdmin, isBotAdmin }) {
  if (!m || !m.text) return
  if (m.isBaileys && m.fromMe) return true
  if (!m.isGroup) return false
  if (!isBotAdmin) return
  let chat = global.db?.data?.chats?.[m.chat]
  if (!chat || !chat.antiLink) return true

  let isGroupLink = m.text.match(groupLinkRegex)
  let isChannelLink = m.text.match(channelLinkRegex)

  if ((isGroupLink || isChannelLink) && !isAdmin) {
    if (isBotAdmin) {
      try {
        const linkThisGroup = `https://chat.whatsapp.com/${await conn.groupInviteCode(m.chat)}`
        if (isGroupLink && m.text.includes(linkThisGroup)) return true // Ignora el link del grupo actual
      } catch (error) {
        console.error("[ERROR] No se pudo obtener el código del grupo:", error)
      }
    }

    await conn.reply(
      m.chat, 
      `> ✦ Se ha eliminado a @${m.sender.split`@`[0]} del grupo por \`Anti-Link\`!\n> No permitimos enlaces de ${isChannelLink ? 'canales' : 'otros grupos'}.`, 
      null, 
      { mentions: [m.sender] }
    )

    if (isBotAdmin) {
      try {
        await conn.sendMessage(m.chat, { delete: m.key }) // elimina mensaje con link
        await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove') // expulsa usuario
        console.log(`Usuario ${m.sender} eliminado del grupo ${m.chat} por Anti-Link`)
      } catch (error) {
        console.error("No se pudo eliminar el mensaje o expulsar al usuario:", error)
      }
    }
  }

  return true
}