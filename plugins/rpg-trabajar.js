let cooldowns = {}

let handler = async (m, { conn }) => {
  let user = global.db.data.users[m.sender]
  let tiempo = 5 * 60
  if (cooldowns[m.sender] && Date.now() - cooldowns[m.sender] < tiempo * 1000) {
    const tiempo2 = segundosAHMS(Math.ceil((cooldowns[m.sender] + tiempo * 1000 - Date.now()) / 1000))
    return conn.reply(m.chat, `*Espérate we*\n\nDebes descansar *${tiempo2}* antes de volver a chambear`, m)
  }

  let rsl = Math.floor(Math.random() * 500) + 50 // ahora siempre mínimo 50
  cooldowns[m.sender] = Date.now()

  await conn.reply(m.chat,
    `❀ *Informe de Trabajo*\n\n➪ *${pickRandom(trabajo)}* *${toNum(rsl)}* ( *${rsl}* ) ${moneda} 💸\n\n> La calle está dura pero la bolsa crece.`,
    m
  )

  user.coin += rsl
}

handler.help = ['trabajar']
handler.tags = ['economy']
handler.command = ['w', 'work', 'chambear', 'chamba', 'trabajar']
handler.group = true
handler.register = true

export default handler

function toNum(number) {
  if (number >= 1000 && number < 1000000) {
    return (number / 1000).toFixed(1) + 'k'
  } else if (number >= 1000000) {
    return (number / 1000000).toFixed(1) + 'M'
  } else if (number <= -1000 && number > -1000000) {
    return (number / 1000).toFixed(1) + 'k'
  } else if (number <= -1000000) {
    return (number / 1000000).toFixed(1) + 'M'
  } else {
    return number.toString()
  }
}

function segundosAHMS(segundos) {
  let minutos = Math.floor((segundos % 3600) / 60)
  let segundosRestantes = segundos % 60
  return `${minutos} minutos y ${segundosRestantes} segundos`
}

function pickRandom(list) {
  return list[Math.floor(list.length * Math.random())]
}

// trabajos con humor más alv
const trabajo = [
  "Te vendiste de payaso en la calle y lograste sacar",
  "Te tocó barrer la cárcel y te dieron",
  "Ayudaste a un narco a esconder la merca y te soltó",
  "Te disfrazaste de botarga en un mercado y conseguiste",
  "Hiciste streaming haciendo el ridículo y ganaste",
  "Trabajaste de doble en una película de acción y recibiste",
  "Le lavaste la troca a un capo y te dejó",
  "Te metiste de chef en una fondita y te pagaron",
  "Trabajaste en una maquila 12 horas y te dieron",
  "Te explotaron en la construcción pero igual cobraste",
  "Fuiste mesero en un bar de mala muerte y te dejaron",
  "Te disfrazaste de Pikachu en un cumpleaños y juntaste",
  "Te rifaste en un concurso de comida picante y te ganaste",
  "Arreglaste PCs con virus y te pagaron",
  "Te pusieron a cargar costales todo el día y te dieron",
  "Vendiste helados bajo el sol y lograste",
  "Le diste clases de español a un gringo y conseguiste",
  "Te convertiste en influencer de memes y recibiste",
  "Te disfrazaste de Minnie Mouse y te dejaron propina de",
  "Trabajaste como extra en una novela y te pagaron",
  "Te contrataron para una boda y terminaste ganando",
  "Te hicieron repartir volantes en el calor y te dieron",
  "Cargaste cajas en una mudanza y te pagaron",
  "Te tocó atender un puesto de tacos y ganaste",
  "Te explotaron en un call center pero cobraste",
  "Fuiste a vender pulseritas y juntaste",
  "Te contrataron para animar una fiesta infantil y te dieron",
  "Te disfrazaste de payaso diabólico y te pagaron",
  "Te tocó sacar la basura del barrio y te dieron",
  "Hiciste trabajos “no muy legales” y te llevaste"
]