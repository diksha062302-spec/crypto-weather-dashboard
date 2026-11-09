
import { useEffect, useState } from 'react'

import {
  Search,
  CloudSun,
  Sun,
  Cloud,
  CloudRain,
  CloudDrizzle,
  CloudSnow,
  CloudLightning,
  Droplets,
  Wind,
  Thermometer,
  RefreshCw,
} from 'lucide-react'

import { searchCity, getWeather } from '../services/weatherApi'

// Convert weather codes into readable descriptions and icons
const getWeatherInfo = (code) => {
  if (code === 0) return { label: 'Clear sky', Icon: Sun }
  if ([1, 2].includes(code)) return { label: 'Partly cloudy', Icon: CloudSun }
  if (code === 3) return { label: 'Overcast', Icon: Cloud }
  if ([45, 48].includes(code)) return { label: 'Foggy', Icon: Cloud }
  if ([51, 53, 55, 56, 57].includes(code)) {
    return { label: 'Drizzle', Icon: CloudDrizzle }
  }
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) {
    return { label: 'Rainy', Icon: CloudRain }
  }
  if ([71, 73, 75, 77, 85, 86].includes(code)) {
    return { label: 'Snowy', Icon: CloudSnow }
  }
  if ([95, 96, 99].includes(code)) {
    return { label: 'Thunderstorm', Icon: CloudLightning }
  }

  return { label: 'Unknown conditions', Icon: CloudSun }
}

function WeatherSection() {
  const [city, setCity] = useState('Pune')
  const [location, setLocation] = useState(null)
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Search city and fetch its weather
  const fetchWeather = async (cityName) => {
    if (!cityName.trim()) {
      setError('Please enter a city name.')
      return
    }

    try {
      setLoading(true)
      setError('')

      const cityData = await searchCity(cityName.trim())

      const weatherData = await getWeather(
        cityData.latitude,
        cityData.longitude
      )

      setLocation(cityData)
      setWeather(weatherData)

    } catch (err) {
      setError(err.message || 'Unable to fetch weather data.')
      setWeather(null)
      setLocation(null)

    } finally {
      setLoading(false)
    }
  }

  // Load default city on first render
  useEffect(() => {
    fetchWeather('Pune')
  }, [])

  const current = weather?.current
  const daily = weather?.daily

  const currentInfo = current
    ? getWeatherInfo(current.weather_code)
    : null

  const CurrentIcon = currentInfo?.Icon

  return (
    <section className="mt-14">

      {/* Section Heading */}
      <div className="mb-7">
        <h2 className="text-2xl font-bold">
          Weather Dashboard
        </h2>

        <p className="text-gray-400 text-sm mt-2">
          Current weather and 7-day forecast
        </p>
      </div>

      {/* City Search */}
      <form
        onSubmit={(e) => {
          e.preventDefault()
          fetchWeather(city)
        }}
        className="flex flex-col sm:flex-row gap-3 mb-7"
      >
        <div className="flex items-center gap-3 flex-1 bg-[#15151f] border border-gray-800 rounded-xl px-4 py-3">
          <Search size={20} className="text-gray-400" />

          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Search city..."
            className="w-full bg-transparent outline-none text-white placeholder:text-gray-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-6 py-3 rounded-xl transition"
        >
          {loading
            ? <RefreshCw size={18} className="animate-spin" />
            : <Search size={18} />
          }

          Search
        </button>
      </form>

      {/* Error */}
      {error && (
        <div className="bg-red-950/30 border border-red-900 rounded-xl p-4 text-red-400 mb-6">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && !weather && (
        <div className="bg-[#15151f] border border-gray-800 rounded-xl p-8 text-center text-gray-400">
          <RefreshCw size={25} className="animate-spin mx-auto mb-3" />
          Fetching weather information...
        </div>
      )}

      {/* Current Weather */}
      {weather && location && current && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

            {/* Main Weather Card */}
            <div className="lg:col-span-2 bg-gradient-to-br from-[#182746] to-[#15151f] border border-gray-800 rounded-2xl p-7">

              <div className="flex justify-between items-start">

                <div>
                  <p className="text-gray-400 text-sm">
                    Current weather
                  </p>

                  <h3 className="text-2xl font-bold mt-2">
                    {location.name}
                  </h3>

                  <p className="text-gray-400 text-sm mt-1">
                    {location.admin1
                      ? `${location.admin1}, `
                      : ''
                    }
                    {location.country}
                  </p>
                </div>

                {CurrentIcon && (
                  <CurrentIcon
                    size={65}
                    className="text-blue-400"
                  />
                )}

              </div>

              <div className="mt-8">

                <h2 className="text-6xl font-bold">
                  {Math.round(current.temperature_2m)}°
                  <span className="text-3xl text-gray-400">C</span>
                </h2>

                <p className="text-gray-300 mt-3 text-lg">
                  {currentInfo.label}
                </p>

                <p className="text-gray-400 text-sm mt-2">
                  Feels like {Math.round(current.apparent_temperature)}°C
                </p>

              </div>

            </div>

            {/* Weather Details */}
            <div className="bg-[#15151f] border border-gray-800 rounded-2xl p-6">

              <h3 className="text-lg font-semibold mb-6">
                Weather Details
              </h3>

              <div className="space-y-7">

                <div className="flex items-center gap-4">
                  <Droplets className="text-blue-400" size={25} />

                  <div>
                    <p className="text-gray-400 text-sm">
                      Humidity
                    </p>

                    <p className="font-semibold text-lg">
                      {current.relative_humidity_2m}%
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Wind className="text-green-400" size={25} />

                  <div>
                    <p className="text-gray-400 text-sm">
                      Wind Speed
                    </p>

                    <p className="font-semibold text-lg">
                      {current.wind_speed_10m} km/h
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Thermometer className="text-orange-400" size={25} />

                  <div>
                    <p className="text-gray-400 text-sm">
                      Precipitation
                    </p>

                    <p className="font-semibold text-lg">
                      {current.precipitation} mm
                    </p>
                  </div>
                </div>

              </div>

            </div>

          </div>

          {/* Seven Day Forecast */}
          <div className="mt-7">

            <h3 className="text-xl font-bold mb-5">
              7-Day Forecast
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">

              {daily.time.map((date, index) => {

                const info = getWeatherInfo(
                  daily.weather_code[index]
                )

                const DayIcon = info.Icon

                const dayName = new Date(
                  `${date}T12:00:00`
                ).toLocaleDateString('en-US', {
                  weekday: 'short',
                })

                return (
                  <div
                    key={date}
                    className="bg-[#15151f] border border-gray-800 rounded-xl p-4 text-center hover:border-blue-500/50 transition"
                  >

                    <p className="font-semibold">
                      {index === 0 ? 'Today' : dayName}
                    </p>

                    <DayIcon
                      size={32}
                      className="text-blue-400 mx-auto my-4"
                    />

                    <p className="text-gray-400 text-xs mb-3">
                      {info.label}
                    </p>

                    <div className="flex justify-center gap-3">
                      <span className="font-semibold">
                        {Math.round(daily.temperature_2m_max[index])}°
                      </span>

                      <span className="text-gray-500">
                        {Math.round(daily.temperature_2m_min[index])}°
                      </span>
                    </div>

                    <p className="text-blue-400 text-xs mt-4">
                      Rain: {daily.precipitation_probability_max[index] ?? 0}%
                    </p>

                  </div>
                )
              })}

            </div>

          </div>
        </>
      )}

    </section>
  )
}

export default WeatherSection
