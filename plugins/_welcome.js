import { WAMessageStubType } from '@whiskeysockets/baileys'
import fetch from 'node-fetch'

export async function before(m, { conn, participants, groupMetadata }) {
  if (!m.messageStubType || !m.isGroup) return !0;
  
  const fkontak = { 
    "key": { 
      "participants":"0@s.whatsapp.net", 
      "remoteJid": "status@broadcast", 
      "fromMe": false, 
      "id": "Halo" 
    }, 
    "message": { 
      "contactMessage": { 
        "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD` 
      }
    }, 
    "participant": "0@s.whatsapp.net"
  }

  let pp = await conn.profilePictureUrl(m.messageStubParameters[0], 'image').catch(_ => 'https://raw.githubusercontent.com/The-King-Destroy/Adiciones/main/Contenido/1745522645448.jpeg')
  let img = await (await fetch(pp)).buffer()
  let chat = global.db.data.chats[m.chat]

  let txtWelcome = 'ゲ◜៹ ¡Nuevo miembro! ៹◞ゲ'
  let txtBye = 'ゲ◜៹ Hasta luego ៹◞ゲ'
  
  let groupSize = participants.length
  if (m.messageStubType == 27) groupSize++
  else if (m.messageStubType == 28 || m.messageStubType == 32) groupSize--

  if (chat.welcome && m.messageStubType == 27) {
    let bienvenida = 
`\`✦ ¡Bienvenid@ a ${groupMetadata.subject}! ✦\`
➤ Hola @${m.messageStubParameters[0].split`@`[0]} 
${global.welcom1}
✐ Ahora somos *${groupSize}* en el grupo
•(=^･ω･^=)• Aquí la pasamos chido, no olvides saludar y participar
> 🌟 Usa *#menu* para conocer los comandos disponibles`
    await conn.sendMini(m.chat, txtWelcome, dev, bienvenida, img, img, redes, fkontak)
  }

  if (chat.welcome && (m.messageStubType == 28 || m.messageStubType == 32)) {
    let despedida = 
`❀ *Nos despedimos de ${groupMetadata.subject}* ❀
✰ @${m.messageStubParameters[0].split`@`[0]}
${global.welcom2}
✦ Ahora somos *${groupSize}* miembros
•(=^･ω･^=)• Vuelve pronto, te vamos a extrañar
> ✐ Recuerda usar *#help* para lo que necesites`
    await conn.sendMini(m.chat, txtBye, dev, despedida, img, img, redes, fkontak)
  }
}