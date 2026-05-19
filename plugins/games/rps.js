module.exports = {
  name: 'rps',
  alias: ['rockpaperscissors'],
  category: 'games',
  reactEmoji: '✊',
  async execute(sock, msg, { from, args }) {
    const choice = args[0]?.toLowerCase()
    if (!['rock', 'paper', 'scissors'].includes(choice)) {
      return sock.sendMessage(from, { text: '❌ Choose rock, paper, or scissors' }, { quoted: msg })
    }
    const botChoice = ['rock', 'paper', 'scissors'][Math.floor(Math.random() * 3)]
    let result
    if (choice === botChoice) result = "Tie!"
    else if ((choice === 'rock' && botChoice === 'scissors') ||
             (choice === 'paper' && botChoice === 'rock') ||
             (choice === 'scissors' && botChoice === 'paper')) result = "You win!"
    else result = "Bot wins!"
    await sock.sendMessage(from, { text: `✊ You: ${choice}\n🤖 Bot: ${botChoice}\n*${result}*` }, { quoted: msg })
  }
}