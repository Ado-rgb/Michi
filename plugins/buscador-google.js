import fetch from 'node-fetch';

let handler = async (m, { text, usedPrefix, command }) => {
  if (!text) {
    return m.reply(`ꕥ Ingresa un término para buscar en Google.\n\n✰ *Ejemplo:*\n> › ${usedPrefix + command} WhatsApp bots`);
  }

  const apiUrl = `https://delirius-apiofc.vercel.app/search/googlesearch?query=${encodeURIComponent(text)}`;

  try {
    const response = await fetch(apiUrl);
    const result = await response.json();

    if (!result.status || !result.data.length) {
      return m.reply(`ꕥ No encontré resultados para *${text}*`);
    }

    let replyMessage = 
`ꕥ Término buscado: *${text}*
ꕥ Resultados encontrados: ${result.data.length}\n`;

    result.data.slice(0, 3).forEach((item, index) => {
      replyMessage += 
`\n${index + 1}. *${item.title}*
> Descripción: ${item.description}
> URL: ${item.url}\n`;
    });

    m.react('✅');
    m.reply(replyMessage.trim());
  } catch (error) {
    console.error(`Error al realizar la búsqueda:`, error);
    m.reply(`✖︎ Ocurrió un error al obtener los resultados.`);
  }
};

handler.command = ['google'];

export default handler;