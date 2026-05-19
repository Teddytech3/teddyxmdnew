const dares = [
  "Send a voice note singing your favorite song.",
  "Send a selfie with a funny face.",
  "I dare you to tag 3 friends and say something nice about them.",
  "Post a status with a motivational quote."
]

module.exports = {
  name: 'dare',
  alias: [],
  category: 'games',
  reactEmoji: '⚡',
  async execute(sock, msg, { from }) {
    const dare = dares[Math.floor(Math.random() * dares.length)]
    await sock.sendMessage(from, { text: `⚡ *Dare:* ${dare}` }, { quoted: msg })
  }
}