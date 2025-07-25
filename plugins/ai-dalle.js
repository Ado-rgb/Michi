import fetch from 'node-fetch'

let handler = async (m, { conn, args, usedPrefix, command }) => {
  const prompt = args.join(' ')
  if (!prompt) return m.reply(
`❀ *Generador de Imágenes AI*

➪ *Uso Correcto ›*
> ${usedPrefix + command} <texto para la imagen>

*Ejemplo ›*
> ${usedPrefix + command} gato kawaii con fondo rosa`
  )

  try {
    await m.react('🕒')

    const api = `https://myapiadonix.vercel.app/api/IAimagen?prompt=${encodeURIComponent(prompt)}`
    const res = await fetch(api)
    const json = await res.json()

    if (json.status !== 200 || !json.result?.image)
      throw new Error('No se pudo generar la imagen')

    await conn.sendMessage(m.chat, {
      image: { url: json.result.image },
      caption: `
❀ *Imagen Generada*

➪ *Prompt ›* ${prompt}
> API: *Adonix AI*
`.trim()
    }, { quoted: m })

    await m.react('✅')

  } catch (e) {
    console.error('Error generando imagen:', e)
    await m.react('✖️')
    m.reply('⚠︎ Ocurrió un error al generar la imagen. Intenta de nuevo más tarde.')
  }
}

handler.command = ['dalle']
handler.help = ['dalle <texto>']
handler.tags = ['ia']
handler.register = true

export default handler