let cooldowns = {}

let handler = async (m, { conn, text, command }) => {
  let users = global.db.data.users
  let senderId = m.sender
  let senderName = conn.getName(senderId)

  let tiempo = 5 * 60
  if (cooldowns[senderId] && Date.now() - cooldowns[senderId] < tiempo * 1000) {
    let tiempo2 = segundosAHMS(Math.ceil((cooldowns[senderId] + tiempo * 1000 - Date.now()) / 1000))
    return m.reply(`🕒 Aún te estás recuperando, espera *${tiempo2}* antes de volver a salir a vender el *culo* alv`)
  }
  cooldowns[senderId] = Date.now()

  let senderCoin = users[senderId].coin || 0
  let randomUserId = Object.keys(users)[Math.floor(Math.random() * Object.keys(users).length)]
  while (randomUserId === senderId) {
    randomUserId = Object.keys(users)[Math.floor(Math.random() * Object.keys(users).length)]
  }
  let randomUserCoin = users[randomUserId].coin || 0

  let minAmount = 15
  let maxAmount = 120
  let randomOption = Math.floor(Math.random() * 10)

  switch (randomOption) {
    case 0: {
      let amount = rand(minAmount, maxAmount)
      users[senderId].coin += amount
      users[randomUserId].coin -= amount
      conn.sendMessage(m.chat, { text: `❀ *Negocio Cerrado*\n\n➪ *${senderName}* mamó fierro a *@${randomUserId.split("@")[0]}* y cobró *+${amount} ${moneda}*\n> Lo dejaste sin alma ni ganas de vivir 🥴`, mentions: [randomUserId] }, { quoted: m })
      break
    }
    case 1: {
      let loss = rand(minAmount, maxAmount)
      users[senderId].coin -= loss
      conn.reply(m.chat, `✘ *Fracaso Total*\n\n➪ Te contrataron para un gangbang y no aguantaste, te descontaron *-${loss} ${moneda}* por “servicio incompleto” 🤢`, m)
      break
    }
    case 2: {
      let gain = rand(minAmount, maxAmount + 50)
      users[senderId].coin += gain
      conn.reply(m.chat, `❀ *Jackpot Sexual*\n\n➪ Te contrató un político degenerado y te dio *+${gain} ${moneda}* para que no lo quemes 🤑`, m)
      break
    }
    case 3: {
      let fine = rand(minAmount, maxAmount)
      users[senderId].coin -= fine
      conn.reply(m.chat, `✘ *Redada Policial*\n\n➪ Te agarró la tira en pleno acto y te quitaron *-${fine} ${moneda}* pa la mordida 🚔`, m)
      break
    }
    case 4: {
      let amount = rand(minAmount, maxAmount)
      users[senderId].coin += amount
      users[randomUserId].coin -= amount
      conn.sendMessage(m.chat, { text: `❀ *Saqueo Carnal*\n\n➪ *${senderName}* cobró *+${amount} ${moneda}* a *@${randomUserId.split("@")[0]}*\n> Le hiciste un 69 turbo y quedó llorando 🤤`, mentions: [randomUserId] }, { quoted: m })
      break
    }
    case 5: {
      let loss = rand(minAmount, maxAmount)
      users[senderId].coin -= loss
      conn.reply(m.chat, `✘ *Cliente Malo*\n\n➪ Te intentaron pagar con “exposición” y terminaste perdiendo *-${loss} ${moneda}* alv 🤡`, m)
      break
    }
    case 6: {
      let mega = rand(minAmount + 50, maxAmount + 100)
      users[senderId].coin += mega
      conn.reply(m.chat, `❀ *Mega Cliente*\n\n➪ Te contrató un jeque árabe para un harem y te pagó *+${mega} ${moneda}* 🐪💰`, m)
      break
    }
    case 7: {
      let loss = rand(minAmount, maxAmount)
      users[senderId].coin -= loss
      conn.reply(m.chat, `✘ *Trabajo Gratis*\n\n➪ Te clonaron la cuenta, trabajaste toda la noche y terminaste *-${loss} ${moneda}* alv 🥲`, m)
      break
    }
    case 8: {
      let gain = rand(minAmount, maxAmount)
      users[senderId].coin += gain
      conn.reply(m.chat, `❀ *Oportunidad Única*\n\n➪ Fuiste a un OnlyFans VIP y te pagaron *+${gain} ${moneda}* por un show extremo 🫦`, m)
      break
    }
    case 9: {
      let gain = rand(minAmount + 20, maxAmount + 200)
      users[senderId].coin += gain
      conn.reply(m.chat, `❀ *Leyenda Urbana*\n\n➪ *${senderName}* rompió récord en la calle y ahora anda forrado con *+${gain} ${moneda}* 💸`, m)
      break
    }
  }
  global.db.write()
}

handler.tags = ['rpg']
handler.help = ['slut']
handler.command = ['slut', 'prostituirse']
handler.register = true
handler.group = true

export default handler

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function segundosAHMS(segundos) {
  let minutos = Math.floor((segundos % 3600) / 60)
  let segundosRestantes = segundos % 60
  return `${minutos} minutos y ${segundosRestantes} segundos`
}