const answers = [
  "Yes", "No", "Maybe", "Ask again later", "Definitely", "Cannot predict now"
]

module.exports = {
  name: '8ball',
  alias: ['magicball'],
  category: 'games',
  reactEmoji: '🎱',
  async execute(sock, msg, { from, args }) {
    const question = args.join(' ')
    if (!question) return sock.sendMessage(from, { text: '❌ Ask a question: .8ball Will I win?' }, { quoted: msg })
    const answer = answers[Math.floor(Math.random() * answers.length)]
    await sock.sendMessage(from, { text: `🎱 *${answer}*` }, { quoted: msg })
  }
}