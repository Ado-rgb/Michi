import fetch from 'node-fetch'

let handler = async (m, { conn, text }) => {
  if (!text) return m.reply('⚠️ Escribe el texto que quieres convertir a voz')

  try {
    await m.react('🎙️')
    let url = `https://myapiadonix.vercel.app/api/tts?text=${encodeURIComponent(text)}&voice=ash`
    let res = await fetch(url)

    if (!res.ok) throw `Error en la API: ${res.statusText}`
    let audio = await res.buffer()

    await conn.sendMessage(m.chat, { audio, mimetype: 'audio/mpeg', ptt: true }, { quoted: m })
  } catch (e) {
    console.error(e)
    m.reply('❌ Hubo un error generando el TTS')
  }
}

handler.help = ['tts <texto>']
handler.tags = ['transformador']
handler.command = /^tts$/i

export default handler