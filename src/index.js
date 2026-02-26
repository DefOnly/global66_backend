require('dotenv').config()

const app = require('./app')

const PORT = process.env.PORT || 3001

// Para desarrollo local
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
  })
}

// Para Vercel (serverless)
module.exports = app
