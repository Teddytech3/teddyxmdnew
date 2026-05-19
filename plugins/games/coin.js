module.exports = {
  name: 'coin',
  alias: ['flip'],
  category: 'games',
  reactEmoji: '🪙',
  async execute(sock, msg, { from }) {
    const result = Math.random() < 0.5 ? 'Heads' : 'Tails'
    await sock.sendMessage(from, { text: `🪙 *Coin flip:* ${result}` }, { quoted: msg })
  }
}