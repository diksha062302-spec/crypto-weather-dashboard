
import axios from 'axios'

// Create Axios instance for CoinGecko API
const cryptoApi = axios.create({
  baseURL: 'https://api.coingecko.com/api/v3',
  timeout: 15000,
})

// ==========================================
// 1. Fetch Current Cryptocurrency Prices
// ==========================================

export const getCryptoPrices = async () => {
  try {
    const response = await cryptoApi.get('/coins/markets', {
      params: {
        vs_currency: 'usd',
        ids: 'bitcoin,ethereum,solana,binancecoin,ripple',
        order: 'market_cap_desc',
        sparkline: false,
        price_change_percentage: '24h',
      },
    })

    return response.data

  } catch (error) {
    console.error(
      'Crypto Prices API Error:',
      error.response?.data || error.message
    )

    throw error
  }
}

// ==========================================
// 2. Fetch Historical Cryptocurrency Prices
// ==========================================

export const getCryptoChart = async (coinId, days) => {
  try {
    const response = await cryptoApi.get(
      `/coins/${coinId}/market_chart`,
      {
        params: {
          vs_currency: 'usd',
          days: days,
        },
      }
    )

    return response.data.prices

  } catch (error) {
    console.error(
      'Crypto Chart API Error:',
      error.response?.data || error.message
    )

    throw error
  }
}
