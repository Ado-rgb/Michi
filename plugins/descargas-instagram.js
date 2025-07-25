import { igdl } from 'ruhend-scraper';

const handler = async (m, { args, conn }) => {
  if (!args[0]) {
    return conn.reply(m.chat, `ꕥ Por favor ingresa un enlace de Instagram.`, m);
  }

  try {
    await m.react(rwait);
    const res = await igdl(args[0]);
    const data = res.data;

    if (!data || data.length === 0) {
      return conn.reply(m.chat, `✎ No se encontró contenido para ese enlace.`, m);
    }

    for (let media of data) {
      let caption = `ꕥ Tipo: ${media.type || 'Desconocido'}\nꕥ Enviado con éxito\n\n✎ Solicitado por: ${m.pushName || 'Usuario'}`;
      await conn.sendFile(m.chat, media.url, 'instagram.mp4', caption, m);
      await m.react(done);
    }
  } catch (e) {
    await m.react(error);
    return conn.reply(m.chat, `✎ Ocurrió un error al obtener el contenido.`, m);
  }
};

handler.command = ['instagram', 'ig'];
handler.tags = ['descargas'];
handler.help = ['instagram', 'ig'];
handler.group = true;
handler.register = true;


export default handler;