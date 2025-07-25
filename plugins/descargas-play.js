import fetch from "node-fetch"
import yts from "yt-search"

const youtubeRegexID = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([a-zA-Z0-9_-]{11})/

const handler = async (m, { conn, text, command }) => {
  try {
    if (!text?.trim()) {
      return conn.reply(m.chat, "❀ *Por favor escribe el nombre o link de la música a descargar*", m)
    }

    // Buscar video
    const videoIdMatch = text.match(youtubeRegexID)
    let ytResult = await yts(videoIdMatch ? `https://youtu.be/${videoIdMatch[1]}` : text)

    if (videoIdMatch) {
      ytResult = ytResult.all.find(v => v.videoId === videoIdMatch[1]) || ytResult.videos.find(v => v.videoId === videoIdMatch[1])
    }
    ytResult = ytResult.all?.[0] || ytResult.videos?.[0] || ytResult
    if (!ytResult) return m.reply("✧ No se encontraron resultados.")

    const { title, url, thumbnail } = ytResult
    const botname = global.botname || "Michino Ai"
    const redes = "https://chat.whatsapp.com/DMTjbGxYv5R7YSzmFHfO5c?mode=r_t"
    const userId = m.sender

    // Miniatura real del video
    const thumbBuffer = await (await fetch(thumbnail)).buffer()

    // Mensaje con externalAdReply usando miniatura del video
    await conn.sendMessage(m.chat, {
      text: `> *🔰 Enviando*\n> ${title}`,
      contextInfo: {
        mentionedJid: [userId],
        externalAdReply: {
          title: '🕒 Procesando tu solicitud..',
          body: textbot,
          mediaType: 1,
          mediaUrl: redes,
          thumbnail: thumbBuffer,
          showAdAttribution: false,
          containsAutoReply: true,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: m })

    // Enviar audio o video
    if (["play", "pl", "yta", "ytmp3", "playaudio"].includes(command)) {
      const api = await (await fetch(`https://api.vreden.my.id/api/ytmp3?url=${url}`)).json()
      if (!api.result?.download?.url) throw new Error("⚠ No se pudo generar el enlace de audio.")
      await conn.sendMessage(m.chat, {
        audio: { url: api.result.download.url },
        fileName: `${api.result.title}.mp3`,
        mimetype: "audio/mpeg",
        ptt: true
      }, { quoted: m })
    } else if (["play2", "ytv", "ytmp4", "mp4"].includes(command)) {
      const res = await fetch(`https://myapiadonix.vercel.app/api/ytmp4?url=${url}`)
      const json = await res.json()
      if (!json.success || !json.data?.download) throw new Error("No se pudo obtener el enlace de video.")
      await conn.sendFile(m.chat, json.data.download, `${json.data.title}.mp4`, title, m)
    } else {
      return conn.reply(m.chat, "✧ Comando no reconocido.", m)
    }

  } catch (e) {
    console.error(e)
    return m.reply(`⚠ Ocurrió un error: ${e.message}`)
  }
}

handler.command = handler.help = ["play", "play2", "ytmp3", "ytmp4"]
handler.tags = ["descargas"]
handler.group = true

export default handler