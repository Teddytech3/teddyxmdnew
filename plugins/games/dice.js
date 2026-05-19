module.exports = {
  name: 'dice',
  alias: ['roll'],
  category: 'games',
  reactEmoji: '🎲',
  async execute(sock, msg, { from }) {
    const roll = Math.floor(Math.random() * 6) + 1
    const dice = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'][roll-1]
    await sock.sendMessage(from, { text: `${dice} *You rolled a ${roll}!*` }, { quoted: msg })
  }
}