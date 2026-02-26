const express = require('express')
const { query, validationResult } = require('express-validator')
const ratesService = require('../services/ratesService')

const router = express.Router()

const VALID_CURRENCIES = ['USD', 'CLP', 'PEN']

router.get('/',
  [
    query('base')
      .optional()
      .isIn(VALID_CURRENCIES)
      .withMessage('Invalid base currency. Valid options: USD, CLP, PEN'),
    query('target')
      .optional()
      .isIn(VALID_CURRENCIES)
      .withMessage('Invalid target currency. Valid options: USD, CLP, PEN')
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        })
      }

      const { base = 'USD', target } = req.query
      const rates = await ratesService.getRates(base, target)

      res.json({
        success: true,
        base,
        rates: target ? { [target]: rates[target] } : rates,
        asOf: new Date().toISOString()
      })
    } catch (error) {
      next(error)
    }
  }
)

module.exports = router
