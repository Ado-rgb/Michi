// xdkeepalive.js
import http from 'http'

let server
let pingInterval

let handler = async (m, { conn, usedPrefix }) => {
  if (server) return conn.reply(m.chat, 'Ya estoy alive, no me vuelvas a despertar 😴', m)

  server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' })
    res.end('Bot alive! 🐶🔥')
  })

  server.listen(3000, () => {
    conn.reply(m.chat, 'Keepalive activado, bot alive siempre! 🔥', m)
    console.log('Servidor keepalive corriendo en puerto 3000')
  })

  pingInterval = setInterval(() => {
    http.get('http://TU-REPLIT-NAME.repl.co/').on('error', e => {
      console.log('Error en keepalive:', e.message)
    })
  }, 270000) // 4.5 minutos
}

handler.help = ['xd']
handler.tags = ['info']
handler.command = ['xd']

export default handler