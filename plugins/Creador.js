import fetch from 'node-fetch';

let handler = async (m, { conn }) => {
  await m.react('❤️');

  let username = await conn.getName(m.sender);

  // Lista de contactos
  let list = [
    {
      displayName: "Mai Bot Creator",
      vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:Mai Bot Dev 1\nTEL;type=CELL;waid=50493732693:50493732693\nEND:VCARD`
    },
    {
      displayName: "Mai Bot Co-Creator",
      vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:Mai Bot Dev 2\nTEL;type=CELL;waid=584242773183:+58 4242773183\nEND:VCARD`
    }
  ];

  await conn.sendMessage(m.chat, {
    contacts: {
      displayName: `${list.length} Contactos`,
      contacts: list
    },
    contextInfo: {
      externalAdReply: {
        title: '🌸 Contactos oficiales de Mai Bot',
        body: 'Creadores y soporte técnico',
        thumbnailUrl: 'https://d.uguu.se/wrCvoNjp.jpg',
        sourceUrl: 'https://whatsapp.com/channel/0029VbAXuUtB4hdYWC6m2R1h',
        mediaType: 1,
        renderLargerThumbnail: true
      }
    }
  }, { quoted: m });

  // Mensaje decorado
  let txt = `✎ *Hola ${username}*\n\n` +
            `Estos son los contactos oficiales:\n\n` +
            `• +504 9373-2693\n` +
            `• +58 424-2773183\n\n` +
            ``;

  await conn.sendMessage(m.chat, { text: txt }, { quoted: m });
};

handler.help = ['owner', 'creador'];
handler.tags = ['info'];
handler.command = /^(owner|creator|creador|dueño)$/i;

export default handler;