import fetch from 'node-fetch'

let handler = async (m, { conn, text }) => {
  if (!text) return m.reply('⚠️ Escribe el texto que quieres convertir a voz')

  try {
    // Muestra que está grabando audio
    await conn.sendPresenceUpdate('recording', m.chat)

    // Llamada a tu API TTS
    let url = `https://myapiadonix.vercel.app/api/tts?text=${encodeURIComponent(text)}&voice=ash`
    let res = await fetch(url)
    if (!res.ok) throw new Error(`Error en la API: ${res.statusText}`)

    // Convertir la respuesta a buffer
    let audioBuffer = Buffer.from(await res.arrayBuffer())

    // Enviar audio como nota de voz
    await conn.sendMessage(m.chat, { audio: audioBuffer, mimetype: 'audio/mpeg', ptt: true }, { quoted: m })
  } catch (e) {
    console.error(e)
    m.reply('❌ Hubo un error generando el TTS')
  }
}

handler.help = ['tts <texto>']
handler.tags = ['herramientas']
handler.command = /^tts$/i

export default handler