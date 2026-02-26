const express = require('express')
const { body, validationResult } = require('express-validator')
const googleSheetsService = require('../services/googleSheetsService')

const router = express.Router()

router.post('/',
  [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Name is required')
      .isLength({ min: 2, max: 100 })
      .withMessage('Name must be between 2 and 100 characters'),
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Valid email is required')
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

      const { name, email } = req.body
      await googleSheetsService.appendSubscriber(name, email)

      res.status(201).json({
        success: true,
        message: 'Successfully subscribed'
      })
    } catch (error) {
      next(error)
    }
  }
)

module.exports = router
