const { google } = require('googleapis')
const path = require('path')

class GoogleSheetsService {
  constructor() {
    this.spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID
    this.auth = null
  }

  async getAuth() {
    if (this.auth) return this.auth

    try {
      let credentials

      // Prioridad 1: Usar JSON desde variable de entorno (Vercel/Production)
      if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
        credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON)
        this.auth = new google.auth.GoogleAuth({
          credentials,
          scopes: ['https://www.googleapis.com/auth/spreadsheets']
        })
      }
      // Prioridad 2: Usar archivo local (Desarrollo)
      else {
        const credentialsPath = process.env.GOOGLE_CREDENTIALS_PATH ||
          path.join(__dirname, '../../credentials/service-account.json')

        this.auth = new google.auth.GoogleAuth({
          keyFile: credentialsPath,
          scopes: ['https://www.googleapis.com/auth/spreadsheets']
        })
      }

      return this.auth
    } catch (error) {
      console.error('Error initializing Google Auth:', error.message)
      throw new Error('Google Sheets authentication failed')
    }
  }

  async appendSubscriber(name, email) {
    if (!this.spreadsheetId) {
      console.log('[MOCK] Would save to Google Sheets:', { name, email })
      console.warn('GOOGLE_SPREADSHEET_ID not configured. Running in mock mode.')
      return { mock: true, name, email }
    }

    try {
      const auth = await this.getAuth()
      const sheets = google.sheets({ version: 'v4', auth })

      const timestamp = new Date().toISOString()

      await sheets.spreadsheets.values.append({
        spreadsheetId: this.spreadsheetId,
        range: 'Subscribers!A:C',
        valueInputOption: 'USER_ENTERED',
        resource: {
          values: [[name, email, timestamp]]
        }
      })

      console.log(`Subscriber added: ${name} (${email})`)
      return { success: true, name, email, timestamp }
    } catch (error) {
      console.error('Error appending to Google Sheets:', error.message)
      throw new Error('Failed to save subscriber')
    }
  }
}

module.exports = new GoogleSheetsService()
