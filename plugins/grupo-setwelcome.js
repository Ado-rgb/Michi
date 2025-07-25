import fs from 'fs'
import path from 'path'

const filePath = path.join('./welcome.json')

// Asegurar que el archivo exista
if (!fs.existsSync(filePath)) {
  fs.writeFileSync(filePath, JSON.stringify({}, null, 2))
}

let welcomeData = JSON.parse(fs.readFileSync(filePath))

// Asegurar que global.welcom1 sea un objeto
global.welcom1 = welcomeData

let handler = async (m, { conn, text }) => {
  if (!m.isGroup) return m.reply('⚠️ Este comando solo funciona en grupos.')
  if (!text) return m.reply('Por favor, proporciona una bienvenida.\nEjemplo: #setwelcome Hola user')

  const welcomeMsg = text.trim()

  // Guardar bienvenida
  welcomeData[m.chat] = welcomeMsg
  global.welcom1[m.chat] = welcomeMsg

  // Guardar en archivo
  fs.writeFileSync(filePath, JSON.stringify(welcomeData, null, 2))

  await m.reply(`✅ Bienvenida para este grupo actualizada:\n> ${welcomeMsg}`)
}

handler.help = ['setwelcome']
handler.tags = ['tools']
handler.command = ['setwelcome']
handler.admin = true

export default handler