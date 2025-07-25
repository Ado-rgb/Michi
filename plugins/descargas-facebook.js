import { igdl } from 'ruhend-scraper'

const handler = async (m, { text, conn, args }) => {
  if (!args[0]) {
    return conn.reply(m.chat, `ꕥ Por favor ingresa un enlace de Facebook.`, m)
  }

  let res;
  try {
    await m.react(rwait);
    res = await igdl(args[0]);
  } catch (e) {
    return conn.reply(m.chat, `✎ Ocurrió un error al obtener los datos. Verifica el enlace.`, m)
  }

  let result = res.data;
  if (!result || result.length === 0) {
    return conn.reply(m.chat, `ꕥ No se encontraron resultados para este enlace.`, m)
  }

  let data;
  try {
    data = result.find(i => i.resolution === "720p (HD)") || result.find(i => i.resolution === "360p (SD)");
  } catch (e) {
    return conn.reply(m.chat, `✎ Error al procesar los datos.`, m)
  }

  if (!data) {
    return conn.reply(m.chat, `ꕥ No se encontró una resolución adecuada para descargar.`, m)
  }

  let video = data.url;
  try {
    let caption = `ꕥ *Descarga completada*\n\n> › *Resolución:* ${data.resolution}\n> › *Formato:* MP4\n> › *Estado:* Enviado con éxito\n\n✎ *Solicitado por:* ${m.pushName || 'Usuario'}`;

    await conn.sendMessage(m.chat, { video: { url: video }, caption, fileName: 'fb.mp4', mimetype: 'video/mp4' }, { quoted: m })
    await m.react(done);
  } catch (e) {
    await m.react(error);
    return conn.reply(m.chat, `✎ Ocurrió un error al enviar el video.`, m)
  }
}

handler.help = ['facebook', 'fb']
handler.tags = ['descargas']
handler.command = ['facebook', 'fb']
handler.group = true
handler.register = true

export default handler