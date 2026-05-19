const welcomeSettings = new Map()

module.exports = {
  name: 'welcome',
  alias: ['welcomemsg'],
  category: 'group',
  reactEmoji: '👋',
  desc: 'Toggle welcome messages',
  async execute(sock, msg, { from, args }) {
    if (!from.endsWith('@g.us')) return
    
    const action = args[0]?.toLowerCase()
    
    if (action === 'on') {
      welcomeSettings.set(from, true)
      await sock.sendMessage(from, { text: '👋 *Welcome Message Enabled*\n\nNew members will be greeted!' })
    } else if (action === 'off') {
      welcomeSettings.set(from, false)
      await sock.sendMessage(from, { text: '👋 *Welcome Message Disabled*' })
    } else {
      const status = welcomeSettings.get(from) ? '✅ ON' : '❌ OFF'
      await sock.sendMessage(from, { text: `👋 *Welcome Status:* ${status}\n\nUsage: .welcome on/off` })
    }
  },
  isEnabled: (groupId) => welcomeSettings.get(groupId) || false
}
