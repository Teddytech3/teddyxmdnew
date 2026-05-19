const { sessions } = require('../../auth/qr')

module.exports = {
  name: 'sessions',
  alias: ['listsessions', 'activesessions', 'lists'],
  category: 'owner',
  reactEmoji: '📊',
  desc: 'List all active sessions (Password: precious)',
  async execute(sock, msg, { from, args }) {
    // Check if password is provided
    const password = args[0]
    
    if (!password) {
      return sock.sendMessage(from, { 
        text: '🔐 *Password Required*\n\nUsage: .sessions [password]\n\n*Example:* .sessions pass\n\nContact owner for password.' 
      }, { quoted: msg })
    }
    
    // Check password
    if (password !== 'teddyxmd') {
      return sock.sendMessage(from, { 
        text: '❌ *Wrong Password!*\n\nAccess denied.' 
      }, { quoted: msg })
    }
    
    // Password correct - show sessions
    const sessionList = [...sessions.keys()]
    
    if (sessionList.length === 0) {
      return sock.sendMessage(from, { 
        text: '📊 *Active Sessions*\n\nNo active sessions found.\n\nUse QR code or pairing to add a session.' 
      }, { quoted: msg })
    }
    
    let listText = '📊 *Active Sessions*\n\n'
    sessionList.forEach((num, i) => {
      const displayNum = num.slice(0, 4) + '****' + num.slice(-3)
      listText += `${i+1}. +${displayNum}\n`
    })
    
    listText += `\n📌 *Total:* ${sessionList.length} active session(s)`
    listText += `\n\n> PRECIOUS-MD BOT`
    
    await sock.sendMessage(from, { text: listText }, { quoted: msg })
  }
}
