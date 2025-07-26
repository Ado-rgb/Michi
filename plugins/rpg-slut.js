let cooldowns = {}

let handler = async (m, { conn, text, command, usedPrefix }) => {
  let users = global.db.data.users
  let senderId = m.sender
  let senderName = conn.getName(senderId)

  let tiempo = 5 * 60
  if (cooldowns[senderId] && Date.now() - cooldowns[senderId] < tiempo * 1000) {
    let tiempo2 = segundosAHMS(Math.ceil((cooldowns[senderId] + tiempo * 1000 - Date.now()) / 1000))
    m.reply(`Debes esperar *${tiempo2}* para volver a vender tu cuerpecito`)
    return
  }
  cooldowns[senderId] = Date.now()

  let senderCoin = users[senderId].coin || 0
  let randomUserId = Object.keys(users)[Math.floor(Math.random() * Object.keys(users).length)]
  while (randomUserId === senderId) {
    randomUserId = Object.keys(users)[Math.floor(Math.random() * Object.keys(users).length)]
  }
  let randomUserCoin = users[randomUserId].coin || 0

  let minAmount = 15
  let maxAmount = 50
  let randomOption = Math.floor(Math.random() * 6) // ahora 6 casos

  switch (randomOption) {
    case 0: {
      let amountTaken = Math.floor(Math.random() * (maxAmount - minAmount + 1)) + minAmount
      users[senderId].coin += amountTaken
      users[randomUserId].coin -= amountTaken
      conn.sendMessage(m.chat, {
        text: `❀ *Transacción Exitosa*\n\n➪ *Usuario ›* ${senderName}\n> ⛁ Ganancia › *+${amountTaken} ${moneda}*\n> ☁︎ Víctima › *@${randomUserId.split("@")[0]}*\n\n> Le hiciste un *combo triple mortal* alv y se quedó tieso 💸`,
        mentions: [randomUserId]
      }, { quoted: m })
      break
    }
    case 1: {
      let amountSubtracted = Math.min(Math.floor(Math.random() * (senderCoin - minAmount + 1)) + minAmount, maxAmount)
      users[senderId].coin -= amountSubtracted
      conn.reply(m.chat, `✘ *Servicio Fallido*\n\n➪ *Usuario ›* ${senderName}\n> ⛁ Pérdida › *-${amountSubtracted} ${moneda}*\n\n> Te resbalaste y te rompiste la espalda alv 💀`, m)
      break
    }
    case 2: {
      let smallAmountTaken = Math.min(Math.floor(Math.random() * (randomUserCoin / 2 - minAmount + 1)) + minAmount, maxAmount)
      users[senderId].coin += smallAmountTaken
      users[randomUserId].coin -= smallAmountTaken
      conn.sendMessage(m.chat, {
        text: `❀ *Pago Completado*\n\n➪ *Usuario ›* ${senderName}\n> ⛁ Ganancia › *+${smallAmountTaken} ${moneda}*\n> ☁︎ Cliente › *@${randomUserId.split("@")[0]}*\n\n> Lo dejaste sin poder caminar y con trauma psicológico 🤕`,
        mentions: [randomUserId]
      }, { quoted: m })
      break
    }
    case 3: {
      let amountBonus = Math.floor(Math.random() * (maxAmount + 20 - minAmount + 1)) + minAmount
      users[senderId].coin += amountBonus
      conn.reply(m.chat, `❀ *Premio Especial*\n\n➪ *Usuario ›* ${senderName}\n> ⛁ Bonus › *+${amountBonus} ${moneda}*\n\n> Un millonario te vio en acción y te dejó propina alv 😏`, m)
      break
    }
    case 4: {
      let fine = Math.floor(Math.random() * (maxAmount - minAmount + 1)) + minAmount
      users[senderId].coin -= fine
      conn.reply(m.chat, `✘ *Multa Judicial*\n\n➪ *Usuario ›* ${senderName}\n> ⛁ Multa › *-${fine} ${moneda}*\n\n> Te agarró la policía por “actividad sospechosa” y te sangraron alv 🚓`, m)
      break
    }
    case 5: {
      let megaWin = Math.floor(Math.random() * (maxAmount + 100 - minAmount + 1)) + minAmount
      users[senderId].coin += megaWin
      conn.reply(m.chat, `❀ *Suerte Legendaria*\n\n➪ *Usuario ›* ${senderName}\n> ⛁ Ganancia › *+${megaWin} ${moneda}*\n\n> Te contrató un jeque árabe y te pagó un dineral bien Riko 🐪💰`, m)
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

function segundosAHMS(segundos) {
  let minutos = Math.floor((segundos % 3600) / 60)
  let segundosRestantes = segundos % 60
  return `${minutos} minutos y ${segundosRestantes} segundos`
}