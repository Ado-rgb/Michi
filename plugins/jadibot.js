import { readdirSync, statSync, unlinkSync, existsSync, readFileSync, watch, rmSync, promises as fsPromises } from "fs";
const fs = { ...fsPromises, existsSync };
import path, { join } from 'path';
import ws from 'ws';

let handler = async (m, { conn: _envio, command, usedPrefix, args, text, isOwner }) => {
  const isCommand1 = /^(deletesesion|deletebot|deletesession|deletesesaion)$/i.test(command);
  const isCommand2 = /^(stop|pausarai|pausarbot)$/i.test(command);
  const isCommand3 = /^(bots|sockets|socket)$/i.test(command);

  async function reportError(e) {
    await m.reply(`✘ Ocurrió un error.`);
    console.log(e);
  }

  switch (true) {
    case isCommand1:
      {
        let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender;
        let uniqid = `${who.split`@`[0]}`;
        const path = `./${jadi}/${uniqid}`;

        if (!await fs.existsSync(path)) {
          await conn.sendMessage(m.chat, {
            text: `❀ Usted no tiene una sesión activa.\nPuede crear una usando:\n*${usedPrefix + command}*\n\nSi tiene un *(ID)* puede saltarse este paso con:\n*${usedPrefix + command}* \`\`\`(ID)\`\`\``
          }, { quoted: m });
          return;
        }

        if (global.conn.user.jid !== conn.user.jid) {
          return conn.sendMessage(m.chat, {
            text: `✧ Use este comando desde el *Bot Principal*.\n\nhttps://api.whatsapp.com/send/?phone=${global.conn.user.jid.split`@`[0]}&text=${usedPrefix + command}&type=phone_number&app_absent=0`
          }, { quoted: m });
        } else {
          await conn.sendMessage(m.chat, { text: `✿ Tu sesión como *Sub-Bot* se ha eliminado.` }, { quoted: m });
        }

        try {
          fs.rmdir(`./${jadi}/` + uniqid, { recursive: true, force: true });
          await conn.sendMessage(m.chat, { text: `✰ Ha cerrado sesión y borrado todo rastro.` }, { quoted: m });
        } catch (e) {
          reportError(e);
        }
      }
      break;

    case isCommand2:
      {
        if (global.conn.user.jid == conn.user.jid) {
          conn.reply(m.chat, `❀ Si no es *Sub-Bot* contacte al número principal para ser *Sub-Bot*.`, m);
        } else {
          await conn.reply(m.chat, `✧ ${botname} desactivada.`, m);
          conn.ws.close();
        }
      }
      break;

    case isCommand3:
      {
        const users = [...new Set([...global.conns.filter((conn) => conn.user && conn.ws.socket && conn.ws.socket.readyState !== ws.CLOSED).map((conn) => conn)])];

        function convertirMsADiasHorasMinutosSegundos(ms) {
          let segundos = Math.floor(ms / 1000);
          let minutos = Math.floor(segundos / 60);
          let horas = Math.floor(minutos / 60);
          let días = Math.floor(horas / 24);
          segundos %= 60;
          minutos %= 60;
          horas %= 24;
          let resultado = "";
          if (días) resultado += `${días} d, `;
          if (horas) resultado += `${horas} h, `;
          if (minutos) resultado += `${minutos} m, `;
          if (segundos) resultado += `${segundos} s`;
          return resultado;
        }

        let lista = users.map((v, i) => `- [Sub *${v.user.name || 'Desconocido'}*] › @${v.user.jid.split('@')[0]}\n  ⌛ *Conectado hace ›* ${v.uptime ? convertirMsADiasHorasMinutosSegundos(Date.now() - v.uptime) : 'Desconocido'}`).join('\n');

        if (!lista) lista = '✘ No hay Sub-Bots disponibles ahora';

        const total = users.length;
        const texto = `ꕥ Sub-Bots Activos *(${total})*

❒ Principales › *1*
✿ Sub-Bots › *${total}*

✎ *Lista de Sub-Bots ›*
${lista}`;

        await _envio.sendMessage(m.chat, { text: texto, mentions: users.map(u => u.user.jid) }, { quoted: m });
      }
      break;
  }
};

handler.tags = ['serbot'];
handler.help = ['sockets', 'deletesesion', 'pausarai'];
handler.command = ['deletesesion', 'deletebot', 'deletesession', 'deletesession', 'stop', 'pausarai', 'pausarbot', 'bots', 'sockets', 'socket'];

export default handler;