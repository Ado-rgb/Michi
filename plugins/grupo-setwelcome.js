import fs from 'fs'
import path from 'path'

const filePath = path.join('./welcome.json')

// cargar datos al iniciar
let welcomeData = {}
if (fs.existsSync(filePath)) {
  try {
    welcomeData = JSON.parse(fs.readFileSync(filePath))
  } catch (e) {
    console.error('Error leyendo welcome.json:', e)
    welcomeData = {}
  }
}

// aseguramos que global.welcom1 exista
global.welcom1 = global.welcom1 || {}

let handler = async (m, { conn, text }) => {
  if (!m.isGroup) return m.reply('⚠️ Este comando solo funciona en grupos.')
  if (!text) return m.reply('Por favor, proporciona una bienvenida.\nEjemplo: #setwelcome Hola user')

  const welcomeMsg = text.trim()

  // guardar en memoria y en global
  welcomeData[m.chat] = welcomeMsg
  global.welcom1[m.chat] = welcomeMsg

  // escribir al archivo
  fs.writeFileSync(filePath, JSON.stringify(welcomeData, null, 2))

  m.reply(`✅ Bienvenida para este grupo actualizada:\n> ${welcomeMsg}`)
}

handler.help = ['setwelcome']
handler.tags = ['tools']
handler.command = ['setwelcome']
handler.admin = true

export default handler