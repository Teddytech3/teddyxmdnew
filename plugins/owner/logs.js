const fs = require('fs')
const path = require('path')

module.exports = {
  name: 'logs',
  alias: ['log', 'history'],
  category: 'owner',
  reactEmoji: '📜',
  desc: 'View bot logs (Password: preciousmk)',
  async execute(sock, msg, { from, args }) {
    const password = args[0]
    
    if (!password || password !== 'teddyxmd') {
      return sock.sendMessage(from, { 
        text: '🔐 *Password Required*\n\n📌 *Usage:* .logs <password>' 
      }, { quoted: msg })
    }
    
    // Try to read from log file
    const logPaths = [
      path.join(__dirname, '../../logs.txt'),
      path.join(__dirname, '../../error.log'),
      path.join(__dirname, '../../combined.log')
    ]
    
    let logsFound = false
    
    for (const logPath of logPaths) {
      if (fs.existsSync(logPath)) {
        const stats = fs.statSync(logPath)
        const fileSize = stats.size / 1024 / 1024 // MB
        
        if (fileSize > 1) {
          // File too large, get last 100 lines
          const logs = fs.readFileSync(logPath, 'utf8').split('\n').slice(-100).join('\n')
          await sock.sendMessage(from, { 
            text: `📜 *Recent Logs*\n\n\`\`\`${logs.slice(0, 3500)}\`\`\`\n\n⚠️ Showing last 100 lines.` 
          }, { quoted: msg })
        } else {
          const logs = fs.readFileSync(logPath, 'utf8').slice(-3500)
          await sock.sendMessage(from, { 
            text: `📜 *Logs from ${path.basename(logPath)}*\n\n\`\`\`${logs}\`\`\`` 
          }, { quoted: msg })
        }
        logsFound = true
        break
      }
    }
    
    if (!logsFound) {
      await sock.sendMessage(from, { 
        text: `📜 *No Logs Found*\n\nTo view logs on Heroku:\n• Go to Heroku Dashboard\n• Open your app\n• Click "More" → "View Logs"\n• Or use: \`heroku logs --tail\`` 
      }, { quoted: msg })
    }
  }
}
