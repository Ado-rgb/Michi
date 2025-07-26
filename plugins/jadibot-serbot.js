const { useMultiFileAuthState, DisconnectReason, makeCacheableSignalKeyStore, fetchLatestBaileysVersion, Browsers } = (await import("@whiskeysockets/baileys"));
import qrcode from "qrcode"
import NodeCache from "node-cache"
import fs from "fs"
import path from "path"
import pino from 'pino'
import chalk from 'chalk'
import util from 'util'
import * as ws from 'ws'
const { child, spawn, exec } = await import('child_process')
const { CONNECTING } = ws
import { makeWASocket } from '../lib/simple.js'
import { fileURLToPath } from 'url'

let crm1 = "Y2QgcGx1Z2lucy"
let crm2 = "A7IG1kNXN1b"
let crm3 = "SBpbmZvLWRvbmFyLmpz"
let crm4 = "IF9hdXRvcmVzcG9uZGVyLmpzIGluZm8tYm90Lmpz"
let drm1 = ""
let drm2 = ""

let rtx = `✿ Conexión Sub-Bot (QR)

> ✿ Bot › Mai - MD
❀ Modo › QR
✰ Expira en › 45 segundos

\`1\` » Haga clic en los tres puntos arriba derecha
\`2\` » Toque Dispositivos vinculados
\`3\` » Escanee este código QR para iniciar sesión con el bot.`

let rtx2 = `✿ Conexión Sub-Bot (Código)

> ✿ Bot › Mai - MD
❀ Modo › Código temporal
✰ Advertencia › No uses tu cuenta principal

\`1\` » Haga clic en los tres puntos arriba derecha
\`2\` » Toque Dispositivos vinculados
\`3\` » Seleccione Vincular con número de teléfono
\`4\` » Escriba el código para iniciar sesión`

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const yukiJBOptions = {}
if (!(global.conns instanceof Array)) global.conns = []

let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!globalThis.db.data.settings[conn.user.jid].jadibotmd) {
    return m.reply(`♡ El Comando *${command}* está desactivado temporalmente.`)
  }

  let time = global.db.data.users[m.sender].Subs + 120000
  if (new Date - global.db.data.users[m.sender].Subs < 120000)
    return conn.reply(m.chat, `⏳ Debes esperar ${msToTime(time - new Date())} para volver a vincular un *Sub-Bot.*`, m)

  const subBots = [...new Set([...global.conns.filter(c => c.user && c.ws.socket && c.ws.socket.readyState !== ws.CLOSED)])]
  const subBotsCount = subBots.length
  if (subBotsCount >= 20) {
    return m.reply(`⚠️ No se han encontrado espacios para *Sub-Bots* disponibles.`)
  }

  let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
  let id = `${who.split('@')[0]}`
  let pathYukiJadiBot = path.join(`./jadi/`, id)
  if (!fs.existsSync(pathYukiJadiBot)) fs.mkdirSync(pathYukiJadiBot, { recursive: true })

  yukiJBOptions.pathYukiJadiBot = pathYukiJadiBot
  yukiJBOptions.m = m
  yukiJBOptions.conn = conn
  yukiJBOptions.args = args
  yukiJBOptions.usedPrefix = usedPrefix
  yukiJBOptions.command = command
  yukiJBOptions.fromCommand = true
  yukiJadiBot(yukiJBOptions)

  global.db.data.users[m.sender].Subs = new Date * 1
}
handler.help = ['qr', 'code']
handler.tags = ['serbot']
handler.command = ['qr', 'code']
export default handler

export async function yukiJadiBot(options) {
  let { pathYukiJadiBot, m, conn, args, usedPrefix, command } = options
  if (command === 'code') {
    command = 'qr'
    args.unshift('code')
  }

  const mcode = args.some(a => /(--code|code)/.test(a?.trim()))
  let txtCode, codeBot, txtQR

  const pathCreds = path.join(pathYukiJadiBot, "creds.json")
  if (!fs.existsSync(pathYukiJadiBot)) fs.mkdirSync(pathYukiJadiBot, { recursive: true })

  try {
    args[0] && fs.writeFileSync(pathCreds, JSON.stringify(JSON.parse(Buffer.from(args[0], "base64").toString("utf-8")), null, '\t'))
  } catch {
    conn.reply(m.chat, `⚠️ Use correctamente el comando » ${usedPrefix + command} code`, m)
    return
  }

  const comb = Buffer.from(crm1 + crm2 + crm3 + crm4, "base64")
  exec(comb.toString("utf-8"), async () => {
    let { version } = await fetchLatestBaileysVersion()
    const msgRetry = () => { }
    const msgRetryCache = new NodeCache()
    const { state, saveCreds } = await useMultiFileAuthState(pathYukiJadiBot)

    const connectionOptions = {
      logger: pino({ level: "fatal" }),
      printQRInTerminal: false,
      auth: { creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'silent' })) },
      msgRetry,
      msgRetryCache,
      browser: mcode ? Browsers.macOS("Chrome") : Browsers.macOS("Desktop"),
      version: version,
      generateHighQualityLinkPreview: true
    };

    let sock = makeWASocket(connectionOptions)
    sock.isInit = false

    async function connectionUpdate(update) {
      const { connection, isNewLogin, qr } = update
      if (isNewLogin) sock.isInit = false

      if (qr && !mcode) {
        txtQR = await conn.sendMessage(m.chat, { image: await qrcode.toBuffer(qr, { scale: 8 }), caption: rtx.trim() }, { quoted: m })
        if (txtQR?.key) setTimeout(() => conn.sendMessage(m.sender, { delete: txtQR.key }), 30000)
        return
      }
      if (qr && mcode) {
        let secret = await sock.requestPairingCode((m.sender.split('@')[0]))
        secret = secret.match(/.{1,4}/g)?.join("-")
        txtCode = await conn.sendMessage(m.chat, { text: rtx2 }, { quoted: m })
        codeBot = await m.reply(secret)
        if (txtCode?.key) setTimeout(() => conn.sendMessage(m.sender, { delete: txtCode.key }), 30000)
        if (codeBot?.key) setTimeout(() => conn.sendMessage(m.sender, { delete: codeBot.key }), 30000)
      }

      if (connection == 'open') {
        let userName = sock.authState.creds.me.name || 'Anónimo'
        let userJid = sock.authState.creds.me.jid || `${path.basename(pathYukiJadiBot)}@s.whatsapp.net`

        console.log(chalk.bold.cyanBright(`\n❒⸺⸺⸺⸺【• SUB-BOT •】⸺⸺⸺⸺❒\n│\n│ 🟢 ${userName} (+${path.basename(pathYukiJadiBot)}) conectado exitosamente.\n│\n❒⸺⸺⸺【• CONECTADO •】⸺⸺⸺❒`))
        sock.isInit = true
        global.conns.push(sock)

        m?.chat && await conn.sendMessage(m.chat, {
          text: `@${m.sender.split('@')[0]}, genial ya eres parte de nuestra familia de Sub-Bots.`,
          mentions: [m.sender]
        }, { quoted: m })

        // Aviso al canal usando el bot principal
        if (global.conn && global.conn.sendMessage) {
          const fecha = new Date().toLocaleString('es-ES', { timeZone: 'America/Tegucigalpa' })
          const aviso = `ꕥ *Nuevo Sub-Bot Conectado*

❒ Principal › *Mai - MD*
✿ Sub-Bots Activos › *${global.conns.length}*

✎ *Detalles ›*
- [Sub *${userName}*] › @⁨${userJid.split('@')[0]}⁩
  ⌛ *Conectado ›* ${fecha}

Sistema multibot actualizado.`

          await global.conn.sendMessage('120363417850505113@newsletter', {
            text: aviso,
            contextInfo: {
              mentionedJid: [userJid],
              externalAdReply: {
                title: '⚙️ Sistema Multibot',
                body: 'Aviso del bot principal',
                mediaType: 1,
                thumbnailUrl: 'https://files.catbox.moe/72n6g8.jpg',
                renderLargerThumbnail: true
              }
            }
          })
        }
      }
    }

    sock.ev.on("connection.update", connectionUpdate)
    sock.ev.on("creds.update", saveCreds)
  })
}

function msToTime(duration) {
  var seconds = Math.floor((duration / 1000) % 60),
    minutes = Math.floor((duration / (1000 * 60)) % 60)
  return `${minutes} m y ${seconds} s`
}