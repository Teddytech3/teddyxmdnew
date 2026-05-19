const { getCategories } = require('./_loader')
const axios = require('axios')

module.exports = {
  name: 'menu',
  alias: ['help', 'cmds', 'allcommands'],
  category: 'utility',
  reactEmoji: '🚩',
  async execute(sock, msg, { from, args }) {
    const categories = getCategories()
    
    if (args[0]) {
      const category = args[0].toLowerCase()
      if (!categories.has(category)) {
        return sock.sendMessage(from, { text: `❌ Category "${category}" not found. Use .menu to see all categories.` }, { quoted: msg })
      }
      const cmds = categories.get(category)
      const cmdList = cmds.map(c => `• .${c}`).join('\n')
      const text = `╭──────────❰ *${category.toUpperCase()}* ❱──────────╮\n${cmdList}\n╰─────────────────────────────────╯`
      return sock.sendMessage(from, { text }, { quoted: msg })
    }
    
    let menuText = `╭──────────❰ *TEDDY-XMD🍂* ❱──────────╮\n│ *Main Menu* – Send .menu <category>\n│\n`
    for (const [cat, cmds] of categories.entries()) {
      menuText += `│ 📁 *${cat}* (${cmds.length} cmds)\n`
    }
    menuText += `│\n│ 🔍 *Examples:* .menu media, .menu games\n╰─────────────────────────────────╯`
    
    const imageUrl = 'https://files.catbox.moe/13nyhx.jpg'
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' })
    await sock.sendMessage(from, {
      image: Buffer.from(response.data),
      caption: menuText
    }, { quoted: msg })
  }
}