import { randomBytes } from "crypto"
import axios from "axios"

let handler = async (m, { conn, text }) => {
  if (!text) return m.reply(`❀ *Uso correcto ›* .demo <texto para preguntar>`)

  try {
    await m.react('🕒')

    const respuesta = await chatGpt(text)

    if (!respuesta || respuesta === 404) throw new Error('No se pudo obtener respuesta.')

    await conn.sendMessage(m.chat, {
      text: `
❀ *Respuesta AI*  
> ${respuesta}
`.trim()
    }, { quoted: m })

    await m.react('✅')
  } catch (err) {
    console.error('Error:', err)
    await m.react('✖️')
    m.reply('⚠︎ Ocurrió un error al procesar tu solicitud.')
  }
}

handler.help = ['demo <texto>']
handler.command = ['demo', 'openai']
handler.tags = ['ai']
handler.group = true

export default handler

async function chatGpt(query) {
  try {
    const { id_ } = (await axios.post(
      "https://chat.chatgptdemo.net/new_chat",
      { user_id: "crqryjoto2h3nlzsg" },
      { headers: { "Content-Type": "application/json" } }
    )).data

    const payload = {
      question: query,
      chat_id: id_,
      timestamp: new Date().getTime()
    }

    const { data } = await axios.post(
      "https://chat.chatgptdemo.net/chat_api_stream",
      payload,
      { headers: { "Content-Type": "application/json" } }
    )

    const chunks = data.split("data: ")
    let res = []

    for (let i = 1; i < chunks.length; i++) {
      if (chunks[i].trim()) {
        res.push(JSON.parse(chunks[i].trim()))
      }
    }

    return res.map(a => a.choices[0]?.delta?.content || '').join('')
  } catch (error) {
    console.error("Error en chatGpt:", error)
    return 404
  }
}