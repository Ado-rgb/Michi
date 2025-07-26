import db from '../lib/database.js'
import fs from 'fs'
import PhoneNumber from 'awesome-phonenumber'
import { createHash } from 'crypto'
import fetch from 'node-fetch'

let Reg = /\|?(.*)([.|] *?)([0-9]*)$/i

let handler = async function (m, { conn, text, usedPrefix, command }) {
  let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
  let pp = await conn.profilePictureUrl(who, 'image').catch(() => 'https://files.catbox.moe/xr2m6u.jpg')
  let user = global.db.data.users[m.sender]
  let name2 = conn.getName(m.sender)

  if (user.registered === true)
    return m.reply(`ꕥ Ya estás registrado.\n\n¿Quieres volver a registrarte?\nUsa: *${usedPrefix}unreg*`)

  if (!Reg.test(text))
    return m.reply(`ꕥ Formato incorrecto.\n\nUso: *${usedPrefix + command} nombre.edad*\nEjemplo: *${usedPrefix + command} ${name2}.18*`)

  let [_, name, splitter, age] = text.match(Reg)
  if (!name) return m.reply(`ꕥ El nombre no puede estar vacío.`)
  if (!age) return m.reply(`ꕥ La edad no puede estar vacía.`)
  if (name.length >= 100) return m.reply(`ꕥ El nombre es demasiado largo.`)

  age = parseInt(age)
  if (age > 1000) return m.reply(`ꕥ Wow el abuelo quiere jugar al bot.`)
  if (age < 5) return m.reply(`ꕥ Hay un abuelo bebé jsjsj.`)

  user.name = name + '✓'.trim()
  user.age = age
  user.regTime = +new Date
  user.registered = true
  global.db.data.users[m.sender].coin += 40
  global.db.data.users[m.sender].exp += 300
  global.db.data.users[m.sender].joincount += 20

  let infoMsg = `ꕥ *USUARIO REGISTRADO* ꕥ

❒ Nombre › *${name}*
✎ Edad › *${age} años*

❀ *Recompensas:*
- ⛁ ${moneda} › *40*
- ✰ Experiencia › *300*
- ❖ Tokens › *20*

⟣ ${dev}`

  await m.react('📩')

  const redes = channel // tu enlace del canal
  const thumbBuffer = await (await fetch(pp)).buffer()
  const userId = m.sender

  // mensaje al chat donde se registró
  await conn.sendMessage(m.chat, {
    text: infoMsg,
    mentions: [userId],
    contextInfo: {
      externalAdReply: {
        title: '✧ New User ✦',
        body: global.textbot || 'Shadow Ultra Edited',
        mediaType: 1,
        mediaUrl: redes,
        thumbnail: thumbBuffer,
        showAdAttribution: false,
        containsAutoReply: true,
        renderLargerThumbnail: true
      }
    }
  }, { quoted: m })

  // mensaje al canal SOLO con externalAdReply y foto de perfil
  await conn.sendMessage('120363417850505113@newsletter', {
    text: '» © ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴍᴀɪ ෆ',
    contextInfo: {
      externalAdReply: {
        title: `➪ Nuevo Registro › ${name} 📝`,
        body: `✩ Usuario › @${m.sender.split('@')[0]}\nⴵ Edad › ${age} años`,
        mediaType: 1,
        mediaUrl: redes,
        thumbnail: thumbBuffer,
        showAdAttribution: false,
        renderLargerThumbnail: true
      }
    }
  })
}

handler.help = ['reg']
handler.tags = ['rg']
handler.command = ['verify', 'verificar', 'reg', 'register', 'registrar']

export default handler