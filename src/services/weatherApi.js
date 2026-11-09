
import axios from 'axios'

const weatherApi = axios.create({
  baseURL: 'https://api.open-meteo.com/v1',
  timeout: 10000,
})

const geoApi = axios.create({
  baseURL: 'https://geocoding-api.open-meteo.com/v1',
  timeout: 10000,
})

// Search city and get coordinates
export const searchCity = async (city) => {
  const response = await geoApi.get('/search', {
    params: {
      name: city,
      count: 1,
      language: 'en',
      format: 'json',
    },
  })

  const location = response.data.results?.[0]

  if (!location) {
    throw new Error('City not found. Please try another city.')
  }

  return location
}

// Fetch current weather and 7-day forecast
export const getWeather = async (latitude, longitude) => {
  const response = await weatherApi.get('/forecast', {
    params: {
      latitude,
      longitude,

      current: [
        'temperature_2m',
        'relative_humidity_2m',
        'apparent_temperature',
        'is_day',
        'precipitation',
        'weather_code',
        'wind_speed_10m',
      ].join(','),

      daily: [
        'weather_code',
        'temperature_2m_max',
        'temperature_2m_min',
        'precipitation_probability_max',
      ].join(','),

      forecast_days: 7,
      timezone: 'auto',
    },
  })

  return response.data
}
