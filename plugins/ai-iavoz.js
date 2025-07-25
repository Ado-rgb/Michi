import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix }) => {
  if (!text) return conn.reply(m.chat, `🗣️ Mande un texto pa que Adonix le hable al toque`, m)

  try {
    // Mostrar que está grabando audio
    await conn.sendPresenceUpdate('recording', m.chat)

    // Obtener el stream de audio directo
    const res = await fetch(`https://myapiadonix.vercel.app/api/adonixvoz?q=${encodeURIComponent(text)}`)

    if (!res.ok) throw new Error('No pude obtener audio de Adonix')

    // Mandar el audio PTT
    await conn.sendMessage(m.chat, {
      audio: res.body,
      mimetype: 'audio/mpeg',
      ptt: true
    }, { quoted: m })

  } catch (e) {
    console.error(e)
    await conn.reply(m.chat, '❌ Error al generar la voz, intentalo otra vez', m)
  }
}

handler.command = ['iavoz']
handler.command = ['iavoz']
handler.tags = ['ai']

export default handler