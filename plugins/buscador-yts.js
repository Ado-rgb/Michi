import yts from 'yt-search'

var handler = async (m, { text, conn }) => {
  if (!text) return conn.reply(m.chat, `ꕥ Ingresa la búsqueda que quieras realizar en YouTube.`, m)

  await conn.reply(m.chat, `✰ *Buscando resultados...*`, m)

  let results = await yts(text)
  let videos = results.all.filter(v => v.type === 'video')

  if (!videos.length) return conn.reply(m.chat, `No se encontraron resultados para: *${text}*`, m)

  let teks = `ꕥ Resultados de la búsqueda para *${text}*\n\n`
  videos.slice(0, 5).forEach((v, i) => {
    teks += `✰ *${i + 1}.*\n`
    teks += `> › *Título:* ${v.title}\n`
    teks += `> › *Canal:* ${v.author.name}\n`
    teks += `> › *Duración:* ${v.timestamp}\n`
    teks += `> › *Subido:* ${v.ago}\n`
    teks += `> › *Vistas:* ${v.views}\n`
    teks += `> › *Enlace:* ${v.url}\n\n`
  })

  await conn.sendFile(m.chat, videos[0].thumbnail, 'yts.jpeg', teks.trim(), m)
}

handler.help = ['ytsearch <texto>']
handler.tags = ['buscador']
handler.command = ['ytbuscar', 'ytsearch', 'yts']
handler.register = true

export default handler