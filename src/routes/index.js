const express = require('express')
const ratesRoutes = require('./rates')
const subscribeRoutes = require('./subscribe')

const router = express.Router()

router.use('/rates', ratesRoutes)
router.use('/subscribe', subscribeRoutes)

router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

module.exports = router
