const MOCK_RATES = {
  USD: {
    CLP: 987.62,
    PEN: 3.81,
    USD: 1
  },
  CLP: {
    USD: 0.00101,
    PEN: 0.00386,
    CLP: 1
  },
  PEN: {
    USD: 0.2625,
    CLP: 259.22,
    PEN: 1
  }
}

class RatesService {
  async getRates(base = 'USD', target = null) {
    const rates = MOCK_RATES[base]

    if (!rates) {
      const error = new Error('Base currency not found')
      error.statusCode = 404
      throw error
    }

    if (target) {
      if (!rates[target]) {
        const error = new Error('Target currency not found')
        error.statusCode = 404
        throw error
      }
      return { [target]: rates[target] }
    }

    return rates
  }
}

module.exports = new RatesService()
