const owners = ['254799963583']

module.exports = {
  name: 'owner',
  alias: ['creator'],
  category: 'utility',
  reactEmoji: '👑',
  async execute(sock, msg, { from }) {
    const text = `👑 *Bot Owner:*\n${owners.map(o => `+${o}`).join('\n')}\n\n_Developed by Teddy Tech_`
    await sock.sendMessage(from, { text }, { quoted: msg })
  }
}