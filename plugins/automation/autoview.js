const enabledSessions = new Set()

module.exports = {
  name: 'autoview',
  alias: ['viewstatus', 'autostatus'],
  category: 'automation',
  reactEmoji: '👁️',
  desc: 'Auto view WhatsApp statuses with 🍂 reaction',
  async execute(sock, msg, { from, args, sessionNumber }) {
    const action = args[0]?.toLowerCase()
    
    if (!action) {
      const status = enabledSessions.has(sessionNumber) ? '✅ ON' : '❌ OFF'
      await sock.sendMessage(from, { text: `🍂 *AutoView Status:* ${status}\n\n📌 *Usage:*\n.autoview on - Enable\n.autoview off - Disable\n\nWhen enabled, I will view and react to all statuses with 🍂` })
      return
    }
    
    if (action === 'on') {
      enabledSessions.add(sessionNumber)
      await sock.sendMessage(from, { text: '🍂 *AutoView Enabled*\n\nI will now view and react to statuses with 🍂' })
    } else if (action === 'off') {
      enabledSessions.delete(sessionNumber)
      await sock.sendMessage(from, { text: '🍂 *AutoView Disabled*' })
    } else {
      await sock.sendMessage(from, { text: '❌ Use: .autoview on  or  .autoview off' })
    }
  },
  isEnabled: (sessionNumber) => enabledSessions.has(sessionNumber)
}
