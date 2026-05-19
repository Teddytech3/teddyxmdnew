const truths = [
  "What's your biggest fear?",
  "What's the last lie you told?",
  "Who is your secret crush?",
  "What's something you're insecure about?"
]

module.exports = {
  name: 'truth',
  alias: [],
  category: 'games',
  reactEmoji: '💬',
  async execute(sock, msg, { from }) {
    const truth = truths[Math.floor(Math.random() * truths.length)]
    await sock.sendMessage(from, { text: `💬 *Truth:* ${truth}` }, { quoted: msg })
  }
}