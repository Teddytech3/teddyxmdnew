const fs = require('fs')
const path = require('path')

module.exports = {
  name: 'mention',
  category: 'automation',
  desc: 'Send audio when bot is mentioned',
  async handleMention(sock, msg, from, sender, botNumber) {
    try {
      // Path to audio file
      const audioPath = path.join(__dirname, '../../audio/dev.mp3')
      
      if (fs.existsSync(audioPath)) {
        const audioBuffer = fs.readFileSync(audioPath)
        
        await sock.sendMessage(from, {
          audio: audioBuffer,
          mimetype: 'audio/mpeg',
          ptt: true // Sends as voice note
        })
        console.log(`[MENTION] Sent audio reply to ${from} (mentioned by ${sender})`)
      } else {
        console.log('[MENTION] Audio file not found:', audioPath)
        // Optional: Send text reply if audio missing
        await sock.sendMessage(from, { 
          text: `🔊 *I was mentioned!*\n\nHello @${sender.split('@')[0]}! How can I help you?`,
          mentions: [sender]
        }).catch(() => {})
      }
    } catch (err) {
      console.error('[MENTION] Error sending audio:', err.message)
    }
  }
}
