module.exports = {
  name: 'hangman',
  alias: [],
  category: 'games',
  reactEmoji: '🔤',
  async execute(sock, msg, { from }) {
    await sock.sendMessage(from, { text: "🔤 *Hangman*\nWord: _ _ _ _ _\nGuess a letter: .guess <letter>" }, { quoted: msg })
  }
}