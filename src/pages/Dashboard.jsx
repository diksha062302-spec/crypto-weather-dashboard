
import { useEffect, useState, useCallback } from 'react'

import CryptoChart from '../components/CryptoChart'
import WeatherSection from '../components/WeatherSection'

import {
  Bitcoin,
  CloudSun,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Search,
} from 'lucide-react'

import { getCryptoPrices } from '../services/cryptoApi'

function Dashboard() {
  const [cryptos, setCryptos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  // Filter and sorting states
  const [filter, setFilter] = useState('all')
  const [sortOrder, setSortOrder] = useState('default')

  // Fetch cryptocurrency data
  const fetchCrypto = useCallback(async () => {
    try {
      setLoading(true)
      setError('')

      const data = await getCryptoPrices()
      setCryptos(data)
    } catch (err) {
      setError('Unable to fetch crypto prices.')
      console.error('Crypto API Error:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch data when component mounts
  useEffect(() => {
    fetchCrypto()
  }, [fetchCrypto])

  // Format prices
  const formatPrice = (price) => {
    if (price == null) return 'N/A'

    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2,
    }).format(price)
  }

  // Search, filter and sort cryptocurrencies
  const filteredCryptos = [...cryptos]
    .filter((coin) =>
      coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((coin) => {
      const change = coin.price_change_percentage_24h

      if (filter === 'gainers') {
        return change != null && change > 0
      }

      if (filter === 'losers') {
        return change != null && change < 0
      }

      return true
    })
    .sort((a, b) => {
      if (sortOrder === 'high') {
        return b.current_price - a.current_price
      }

      if (sortOrder === 'low') {
        return a.current_price - b.current_price
      }

      return 0
    })

  return (
    <div className="min-h-screen bg-[#09090f] text-white">
      <div className="max-w-7xl mx-auto px-6 py-8 md:px-10">

        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-12">
          <h1 className="text-3xl font-bold">
            Crypto<span className="text-blue-400">Weather</span>
          </h1>

          <p className="text-gray-400 text-sm">
            Market & Weather Overview
          </p>
        </header>

        {/* Welcome */}
        <section className="mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            Dashboard Overview
          </h2>

          <p className="text-gray-400">
            Track cryptocurrency markets and weather conditions.
          </p>
        </section>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Crypto Overview */}
          <div className="bg-[#15151f] border border-gray-800 rounded-2xl p-7">
            <Bitcoin size={40} className="text-orange-400 mb-6" />

            <h3 className="text-2xl font-semibold mb-3">
              Crypto Market
            </h3>

            <p className="text-gray-400">
              Track cryptocurrency prices, market capitalization
              and market trends.
            </p>

            <div className="flex gap-2 items-center mt-6 text-green-400">
              <TrendingUp size={18} />
              Explore market trends
            </div>
          </div>

          {/* Weather Overview */}
          <div className="bg-[#15151f] border border-gray-800 rounded-2xl p-7">
            <CloudSun size={40} className="text-blue-400 mb-6" />

            <h3 className="text-2xl font-semibold mb-3">
              Weather Forecast
            </h3>

            <p className="text-gray-400">
              Explore current weather, temperature, humidity
              and upcoming forecasts.
            </p>

            <div className="flex gap-2 items-center mt-6 text-blue-400">
              <CloudSun size={18} />
              Explore weather updates
            </div>
          </div>
        </div>

        {/* Crypto Market Section */}
        <section className="mt-14">

          {/* Heading and Refresh */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold">
                Cryptocurrency Prices
              </h2>

              <p className="text-gray-400 text-sm mt-2">
                Live market overview
              </p>
            </div>

            <button
              onClick={fetchCrypto}
              disabled={loading}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg disabled:opacity-50 transition"
            >
              <RefreshCw
                size={16}
                className={loading ? 'animate-spin' : ''}
              />
              Refresh
            </button>
          </div>

          {/* Search */}
          <div className="relative mb-6">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
            />

            <input
              type="text"
              placeholder="Search by coin name or symbol..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-96 bg-[#15151f] border border-gray-700 rounded-lg pl-11 pr-4 py-3 text-white outline-none focus:border-blue-500 transition"
            />
          </div>

          {/* Filters and Sorting */}
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-8">

            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2">
              {['all', 'gainers', 'losers'].map((item) => (
                <button
                  key={item}
                  onClick={() => setFilter(item)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition ${
                    filter === item
                      ? 'bg-blue-600 text-white'
                      : 'bg-[#15151f] text-gray-400 hover:bg-gray-800'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="bg-[#15151f] border border-gray-700 rounded-lg px-4 py-2 text-gray-300 outline-none focus:border-blue-500"
            >
              <option value="default">Default Order</option>
              <option value="high">Price: High to Low</option>
              <option value="low">Price: Low to High</option>
            </select>
          </div>

          {/* Loading */}
          {loading && (
            <p className="text-gray-400 py-8">
              Loading cryptocurrency prices...
            </p>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="bg-[#15151f] p-6 rounded-xl">
              <p className="text-red-400">{error}</p>

              <button
                onClick={fetchCrypto}
                className="mt-4 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Crypto Cards */}
          {!loading && !error && (
            <>
              {filteredCryptos.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

                  {filteredCryptos.map((coin) => {
                    const positive =
                      coin.price_change_percentage_24h >= 0

                    return (
                      <div
                        key={coin.id}
                        className="bg-[#15151f] border border-gray-800 rounded-xl p-5 hover:border-blue-500/50 transition"
                      >

                        {/* Coin Details */}
                        <div className="flex items-center gap-3 mb-5">
                          <img
                            src={coin.image}
                            alt={coin.name}
                            className="w-10 h-10"
                          />

                          <div>
                            <h3 className="font-semibold">
                              {coin.name}
                            </h3>

                            <p className="text-gray-400 text-xs uppercase">
                              {coin.symbol}
                            </p>
                          </div>
                        </div>

                        {/* Current Price */}
                        <h2 className="text-2xl font-bold mb-3">
                          {formatPrice(coin.current_price)}
                        </h2>

                        {/* 24 Hour Change */}
                        <div
                          className={`flex items-center gap-2 text-sm ${
                            positive
                              ? 'text-green-400'
                              : 'text-red-400'
                          }`}
                        >
                          {positive ? (
                            <TrendingUp size={17} />
                          ) : (
                            <TrendingDown size={17} />
                          )}

                          {coin.price_change_percentage_24h?.toFixed(2) ?? 'N/A'}%

                          <span className="text-gray-500">
                            (24h)
                          </span>
                        </div>

                        {/* Market Cap */}
                        <div className="border-t border-gray-800 mt-5 pt-4">
                          <p className="text-gray-500 text-xs mb-1">
                            Market Capitalization
                          </p>

                          <p className="text-gray-300 text-sm">
                            {formatPrice(coin.market_cap)}
                          </p>
                        </div>

                      </div>
                    )
                  })}

                </div>
              ) : (
                <div className="bg-[#15151f] border border-gray-800 rounded-xl p-8 text-center">
                  <Search
                    size={32}
                    className="mx-auto text-gray-500 mb-3"
                  />

                  <h3 className="text-lg font-semibold">
                    No cryptocurrency found
                  </h3>

                  <p className="text-gray-400 text-sm mt-2">
                    Try changing your search or filter.
                  </p>
                </div>
              )}
            </>
          )}

        </section>

        {/* Crypto Analytics Chart */}
        <CryptoChart />

        {/* Weather Dashboard */}
        <WeatherSection />

      </div>
    </div>
  )
}

export default Dashboard
