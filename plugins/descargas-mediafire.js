const frases = [
  'No dejes para mañana lo que puedas hacer hoy.',
  'El éxito es la suma de pequeños esfuerzos repetidos día tras día.',
  'La vida es 10% lo que te pasa y 90% cómo reaccionas a ello.',
  'El que quiere celeste que le cueste.',
  'Haz lo que amas y no trabajarás ni un solo día de tu vida.',
  'El que busca encuentra, pero el que no busca no se queja.',
  'Cuando una puerta se cierra, otra se abre.',
  'Si no luchas por lo que quieres, no llores por lo que pierdes.'
]

const handler = async (m, { conn, command }) => {
  try {
    if (command === 'fraseslista') {
      // Lista interactiva con todas las frases
      const sections = [
        {
          title: 'Frases chidas',
          rows: frases.map((frase, i) => ({
            title: `Frase #${i + 1}`,
            description: frase,
            rowId: `frase_select ${i}`
          }))
        }
      ]

      await conn.sendMessage(m.chat, {
        text: 'Selecciona una frase para verla:',
        footer: 'Bot de frases secretas',
        title: 'Frases super chidas',
        buttonText: 'Elige una frase',
        sections
      }, { quoted: m })

    } else if (command === 'frase_select') {
      const args = m.text.split(' ')
      const index = parseInt(args[1])
      if (isNaN(index) || index < 0 || index >= frases.length) return m.reply('❌ Frase no válida.')

      const frase = frases[index]
      await conn.sendMessage(m.chat, { text: `✨ Aquí tienes la frase:\n\n${frase}` }, { quoted: m })

    } else if (command === 'botonsecreto') {
      // Botones secretos
      const buttons = [
        { buttonId: 'secreto1', buttonText: { displayText: '🔐 Secreto 1' }, type: 1 },
        { buttonId: 'secreto2', buttonText: { displayText: '🔒 Secreto 2' }, type: 1 }
      ]

      await conn.sendMessage(m.chat, {
        text: 'Aquí están los botones secretos, dale clic al que quieras',
        footer: 'Botonera secreta',
        buttons,
        headerType: 1
      }, { quoted: m })

    } else if (command === 'secreto1') {
      await conn.sendMessage(m.chat, { text: '¡Has descubierto el secreto 1! 🎉' }, { quoted: m })

    } else if (command === 'secreto2') {
      await conn.sendMessage(m.chat, { text: '¡Has desbloqueado el secreto 2! 🔥' }, { quoted: m })

    } else {
      await m.reply('Comando no reconocido.')
    }

  } catch (e) {
    console.error(e)
    m.reply('❌ Error en el comando de frases.')
  }
}

handler.command = ['fraseslista', 'frase_select', 'botonsecreto', 'secreto1', 'secreto2']
handler.tags = ['diversión']
handler.group = false

export default handler