require('dotenv').config()
const express = require('express')
const path = require('path')
const { sessions, qrStore, createSessionViaQR, createSessionViaPairing, restoreAllSessions } = require('./auth/qr')
const { startBackupScheduler } = require('./utils/backup')
const { loadPlugins } = require('./plugins/_loader')
const logger = require('./utils/logger')

const app = express()
app.use(express.json())
app.use(express.static(path.join(__dirname, 'web')))

// Load all command plugins
loadPlugins()

// API: Get bot statistics
app.get('/api/stats', (req, res) => {
  const nums = [...sessions.keys()]
  res.json({
    sessions: nums.length,
    numbers: nums.map(n => n.slice(0, 3) + '****' + n.slice(-2)),
    uptime: process.uptime()
  })
})

// API: Generate QR code for WhatsApp
app.post('/api/qr', async (req, res) => {
  const { number } = req.body
  if (!number) return res.json({ error: 'Number required' })
  
  const clean = number.replace(/\D/g, '')
  if (clean.length < 10) return res.json({ error: 'Invalid number' })
  if (sessions.has(clean)) return res.json({ error: 'Already connected' })

  qrStore.delete(clean)
  
  // Start session creation (don't await - let it run in background)
  createSessionViaQR(clean).catch(err => {
    logger.error(`QR session creation failed for ${clean}:`, err)
  })

  // Wait for QR code (max 20 seconds)
  for (let i = 0; i < 40; i++) {
    await new Promise(r => setTimeout(r, 500))
    if (qrStore.has(clean)) break
  }
  
  const qr = qrStore.get(clean)
  if (qr) {
    res.json({ qr })
  } else {
    res.json({ error: 'QR not ready. Please try again.' })
  }
})

// API: Generate pairing code
app.post('/api/pair', async (req, res) => {
  const { number } = req.body
  if (!number) return res.json({ error: 'Number required' })
  
  const clean = number.replace(/\D/g, '')
  if (clean.length < 10) return res.json({ error: 'Invalid number' })
  
  try {
    const code = await createSessionViaPairing(clean)
    res.json({ code })
  } catch (err) {
    logger.error(`Pairing failed for ${clean}:`, err)
    res.json({ error: err.message })
  }
})

// Serve web dashboard for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'web', 'index.html'))
})

// Global error handlers
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err)
})

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason)
})

// Start server
const PORT = process.env.PORT || 3000
app.listen(PORT, async () => {
  logger.info('╔═══════════════════════════════════╗')
  logger.info('║   TEDDY XMD  🍂 v3.0 READY   ║')
  logger.info('╚═══════════════════════════════════╝')
  logger.info(`🌐 Dashboard: http://localhost:${PORT}`)
  
  // Restore all saved sessions
  await restoreAllSessions()
  
  // Start backup scheduler
  startBackupScheduler()
})
