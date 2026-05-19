// Simple in-memory game state (only one game at a time for demo)
let gameBoard = null
let currentPlayer = null

module.exports = {
  name: 'tictactoe',
  alias: ['ttt'],
  category: 'games',
  reactEmoji: '❌',
  async execute(sock, msg, { from, args }) {
    if (!gameBoard) {
      gameBoard = [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ']
      currentPlayer = 'X'
      await sock.sendMessage(from, { text: "Game started! You are X. Send a number (1-9) to place your mark.\n1|2|3\n4|5|6\n7|8|9" }, { quoted: msg })
    } else {
      await sock.sendMessage(from, { text: "Game already in progress." }, { quoted: msg })
    }
  }
}