import { WAMessageStubType } from '@whiskeysockets/baileys'
import fetch from 'node-fetch'

export async function before(m, { conn, participants, groupMetadata }) {
  if (!m.messageStubType || !m.isGroup) return !0

  const fkontak = { 
    key: { 
      participants: "0@s.whatsapp.net", 
      remoteJid: "status@broadcast", 
      fromMe: false, 
      id: "Halo" 
    }, 
    message: { 
      contactMessage: { 
        vcard: `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD` 
      }
    }, 
    participant: "0@s.whatsapp.net"
  }

  let userJid = m.messageStubParameters[0]
  let pp = await conn.profilePictureUrl(userJid, 'image').catch(_ => 'https://raw.githubusercontent.com/The-King-Destroy/Adiciones/main/Contenido/1745522645448.jpeg')
  let chat = global.db.data.chats[m.chat]

  let groupSize = participants.length
  if (m.messageStubType == 27) groupSize++
  else if (m.messageStubType == 28 || m.messageStubType == 32) groupSize--

  if (chat.welcome && m.messageStubType == 27) {
    let bienvenida = 
`ꕥ Bienvenid@ a *${groupMetadata.subject}*!

✰ *Nuevo miembro:*
> › @${userJid.split('@')[0]}

✰ *Detalles:*
> › Ahora somos *${groupSize}* en el grupo
> › ${global.welcom1 || 'Pásala chido, saluda y participa'}
> › Usa *#menu* para ver los comandos`
    await conn.sendMessage(m.chat, { 
      image: { url: pp },
      caption: bienvenida,
      mentions: [userJid]
    }, { quoted: fkontak })
  }

  if (chat.welcome && (m.messageStubType == 28 || m.messageStubType == 32)) {
    let despedida = 
`ꕥ Adiós de *${groupMetadata.subject}*!

✰ *Se fue:*
> › @${userJid.split('@')[0]}

✰ *Detalles:*
> › Ahora somos *${groupSize}* miembros
> › ${global.welcom2 || 'Vuelve pronto, te vamos a extrañar'}
> › Usa *#help* si necesitas algo`
    await conn.sendMessage(m.chat, { 
      image: { url: pp },
      caption: despedida,
      mentions: [userJid]
    }, { quoted: fkontak })
  }
}