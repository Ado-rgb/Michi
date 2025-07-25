import fetch from "node-fetch"
import yts from 'yt-search'

const youtubeRegexID = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([a-zA-Z0-9_-]{11})/

const handler = async (m, { conn, text, command }) => {
  try {
    if (!text.trim()) return conn.reply(m.chat, `❀ Porfa escribe el nombre o link de la música`, m)

    let videoIdToFind = text.match(youtubeRegexID) || null
    let ytplay2 = await yts(videoIdToFind === null ? text : 'https://youtu.be/' + videoIdToFind[1])

    if (videoIdToFind) {
      const videoId = videoIdToFind[1]
      ytplay2 = ytplay2.all.find(i => i.videoId === videoId) || ytplay2.videos.find(i => i.videoId === videoId)
    }
    ytplay2 = ytplay2.all?.[0] || ytplay2.videos?.[0] || ytplay2
    if (!ytplay2) return m.reply('✧ No encontré nada de eso.')

    const { title, url } = ytplay2
    const botname = global.wm || 'MiBot'
    const [botBody, gcbot_short] = global.hyd_gcbot || ['Unirme al grupo', 'https://chat.whatsapp.com/defaultlink']
    const banner = 'https://files.catbox.moe/h3lk3c.jpg'
    const thumbBuffer = await (await fetch(banner)).buffer()

    await conn.sendMessage(m.chat, {
      text: `✅ *Subida exitosa*\n${title}`,
      contextInfo: {
        mentionedJid: [m.sender],
        externalAdReply: {
          title: botname,
          body: `🔗 ${botBody}`,  // Este texto sale como “botón”
          mediaType: 1,
          mediaUrl: gcbot_short,
          sourceUrl: gcbot_short,
          thumbnail: thumbBuffer,
          showAdAttribution: false,
          containsAutoReply: true,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: m })

    if (['play', 'pl', 'yta', 'ytmp3', 'playaudio'].includes(command)) {
      const api = await (await fetch(`https://api.vreden.my.id/api/ytmp3?url=${url}`)).json()
      if (!api.result?.download?.url) throw new Error('⚠ No se pudo generar enlace audio.')
      await conn.sendMessage(m.chat, { audio: { url: api.result.download.url }, fileName: `${api.result.title}.mp3`, mimetype: 'audio/mpeg' }, { quoted: m })
    } else if (['play2', 'ytv', 'ytmp4', 'mp4'].includes(command)) {
      const res = await fetch(`https://myapiadonix.vercel.app/api/ytmp4?url=${url}`)
      const json = await res.json()
      if (!json.success || !json.data?.download) throw new Error('No se pudo obtener enlace video')
      await conn.sendFile(m.chat, json.data.download, `${json.data.title}.mp4`, title, m)
    } else {
      return conn.reply(m.chat, '✧ Comando no reconocido.', m)
    }

  } catch (e) {
    return m.reply(`⚠ Ocurrió un error: ${e.message}`)
  }
}

handler.command = handler.help = ['play', 'pl']
handler.tags = ['descargas']
handler.group = true

export default handler