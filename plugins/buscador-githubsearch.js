import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return conn.reply(m.chat, `ꕥ Ingresa el nombre de un repositorio de GitHub.\n\n✰ *Ejemplo:*\n> › ${usedPrefix + command} whatsapp-bot`, m);

  try {
    let api = `https://dark-core-api.vercel.app/api/search/github?key=api&text=${encodeURIComponent(text)}`;
    let response = await fetch(api);
    let json = await response.json();

    if (!json.results || !json.results.length) {
      return m.reply(`ꕥ No encontré resultados para *${text}*`);
    }

    let result = json.results[0];

    let txt = 
`╭─⋆˚✿˖° ❀ *REPOSITORIO ENCONTRADO* ❀ ⋆˚✿˖°─╮
│ ꕥ › *Nombre:* ${result.name}
│ ꕥ › *Owner:* ${result.creator}
│ ꕥ › *Estrellas:* ${result.stars}
│ ꕥ › *Bifurcaciones:* ${result.forks}
│ ꕥ › *Descripción:* ${result.description || 'Sin descripción'}
│ ꕥ › *Creado:* ${result.createdAt}
│ ꕥ › *Link:* ${result.cloneUrl}
╰───────────────────────╯`;

    let img = 'https://raw.githubusercontent.com/The-King-Destroy/Adiciones/main/Contenido/1745610598914.jpeg';

    await conn.sendMessage(m.chat, { 
      text: txt,
      contextInfo: {
        mentionedJid: [m.sender],
        externalAdReply: {                
          title: botname,
          body: textbot,
          mediaType: 1,
          mediaUrl: result.cloneUrl,
          sourceUrl: result.cloneUrl,
          thumbnail: await (await fetch(img)).buffer(),
          showAdAttribution: false,
          containsAutoReply: true,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: m })

  } catch (error) {
    console.error(error)
    m.reply(`Error: ${error.message}`);
    m.react('✖️');
  }
};

handler.command = ['githubsearch', 'gbsearch'];

export default handler;