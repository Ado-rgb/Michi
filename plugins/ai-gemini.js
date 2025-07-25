import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return conn.reply(m.chat, `❀ *Uso correcto ›* ${usedPrefix + command} <pregunta para Gemini>`, m)
  }

  try {
    await m.react('🕒')
    await conn.sendPresenceUpdate('composing', m.chat)

    const api = `https://apis-starlights-team.koyeb.app/starlight/gemini?text=${encodeURIComponent(text)}`
    const res = await fetch(api)
    const json = await res.json()

    if (!json.result) throw new Error('Sin respuesta.')

    await conn.sendMessage(m.chat, {
      text: `
❀ *Gemini AI*  
> ${json.result}
`.trim()
    }, { quoted: m })

    await m.react('✅')
  } catch (e) {
    console.error('Error en Gemini:', e)
    await m.react('✖️')
    await conn.reply(m.chat, `⚠︎ Gemini no pudo responder a esa pregunta.`, m)
  }
}

handler.command = ['gemini']
handler.help = ['gemini <texto>']
handler.tags = ['ai']
handler.group = true

export default handler