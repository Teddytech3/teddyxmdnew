const { backupSessions } = require('../../utils/backup')
const owners = ['254747963583','254799963583']

module.exports = {
  name: 'backup',
  alias: ['manualbackup'],
  category: 'owner',
  reactEmoji: '💾',
  async execute(sock, msg, { from, sender }) {
    if (!owners.includes(sender)) return sock.sendMessage(from, { text: '❌ Owner only.' }, { quoted: msg })
    await backupSessions()
    await sock.sendMessage(from, { text: '✅ Manual backup completed.' }, { quoted: msg })
  }
}