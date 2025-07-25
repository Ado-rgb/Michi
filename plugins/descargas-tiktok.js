import fetch from 'node-fetch';

var handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) {
    return conn.reply(m.chat, `ꕥ Pone un link de TikTok mano.`, m);
  }

  try {
    await conn.reply(m.chat, `ꕥ Espera un toque, bajando video...`, m);

    const tiktokData = await tiktokdl(args[0]);

    if (!tiktokData || !tiktokData.data || !tiktokData.data.play) {
      return conn.reply(m.chat, `ꕥ No se pudo obtener el video.`, m);
    }

    const videoURL = tiktokData.data.play;

    if (videoURL) {
      await conn.sendFile(
        m.chat,
        videoURL,
        "tiktok.mp4",
        `ꕥ Aquí tienes tu video.`,
        m
      );
    } else {
      return conn.reply(m.chat, `ꕥ No se pudo descargar we.`, m);
    }
  } catch (error) {
    return conn.reply(m.chat, `ꕥ Error: ${error.message}`, m);
  }
};

handler.help = ['tiktok *<link>*'];
handler.tags = ['descargas'];
handler.command = ['tiktok', 'tt'];
handler.group = true;
handler.register = true;

export default handler;

async function tiktokdl(url) {
  let tikwm = `https://www.tikwm.com/api/?url=${url}?hd=1`;
  let response = await (await fetch(tikwm)).json();
  return response;
}