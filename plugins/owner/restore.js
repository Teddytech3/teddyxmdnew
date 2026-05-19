const { sessions, restoreAllSessions } = require('../../auth/session-store')
const { createSessionViaQR } = require('../../auth/qr')
const owners = ['254799963583', '254747963583']

module.exports = {
  name: 'restore',
  alias: ['restoresessions'],
  category: 'owner',
  reactEmoji: '💾',
  async execute(sock, msg, { from, sender }) {
    if (!owners.includes(sender)) return sock.sendMessage(from, { text: '❌ Owner only.' }, { quoted: msg })
    await sock.sendMessage(from, { text: '🔄 Restoring sessions from database...' }, { quoted: msg })
    await restoreAllSessions(createSessionViaQR)
    await sock.sendMessage(from, { text: `✅ Restored ${sessions.size} sessions.` }, { quoted: msg })
  }
}