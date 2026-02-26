const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const routes = require('./routes')
const errorHandler = require('./middleware/errorHandler')

const app = express()

app.use(helmet())
app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:3000',
      'http://192.168.43.1:3000',
      'http://127.0.0.1:3000',
      process.env.FRONTEND_URL,
      /\.vercel\.app$/  // Permite todos los dominios de Vercel
    ]
    if (!origin) {
      callback(null, true)
    } else if (allowedOrigins.some(allowed => {
      if (typeof allowed === 'string') return allowed === origin
      if (allowed instanceof RegExp) return allowed.test(origin)
      return false
    })) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true
}))
app.use(express.json())
app.use(morgan('combined'))

app.use('/api', routes)

app.use(errorHandler)

module.exports = app
