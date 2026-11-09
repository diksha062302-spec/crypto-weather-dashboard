
import { useCallback, useEffect, useState } from 'react'

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts'

import {
  RefreshCw,
  TrendingUp,
  TrendingDown,
} from 'lucide-react'

import {
  getCryptoChart,
  getCryptoPrices,
} from '../services/cryptoApi'

function CryptoChart() {
  const [coin, setCoin] = useState('bitcoin')
  const [days, setDays] = useState('7')

  const [chartData, setChartData] = useState([])
  const [selectedCoin, setSelectedCoin] = useState(null)

  const [loading, setLoading] = useState(true)
  const [summaryLoading, setSummaryLoading] = useState(true)

  const [error, setError] = useState('')
  const [summaryError, setSummaryError] = useState('')

  // Format price
  const formatPrice = (price) => {
    if (price == null) return 'N/A'

    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2,
    }).format(price)
  }

  // Fetch historical chart data
  const fetchChart = useCallback(async () => {
    try {
      setLoading(true)
      setError('')

      const data = await getCryptoChart(coin, days)

      const formattedData = data.map(([timestamp, price]) => ({
        time: timestamp,
        price,
      }))

      setChartData(formattedData)

    } catch (err) {
      console.error('Chart API Error:', err)

      setError('Unable to load chart data. Please try again.')
      setChartData([])

    } finally {
      setLoading(false)
    }
  }, [coin, days])

  // Fetch chart whenever coin or period changes
  useEffect(() => {
    fetchChart()
  }, [fetchChart])

  // Fetch selected coin summary
  useEffect(() => {
    let cancelled = false

    const fetchCoinSummary = async () => {
      try {
        setSummaryLoading(true)
        setSummaryError('')

        const data = await getCryptoPrices()

        const selected = data.find(
          (item) => item.id === coin
        )

        if (!selected) {
          throw new Error('Coin information not found')
        }

        if (!cancelled) {
          setSelectedCoin(selected)
        }

      } catch (err) {
        console.error('Coin Summary Error:', err)

        if (!cancelled) {
          setSummaryError('Unable to load coin information.')
          setSelectedCoin(null)
        }

      } finally {
        if (!cancelled) {
          setSummaryLoading(false)
        }
      }
    }

    fetchCoinSummary()

    return () => {
      cancelled = true
    }
  }, [coin])

  // Format chart dates
  const formatDate = (timestamp) => {
    const date = new Date(timestamp)

    if (days === '1') {
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      })
    }

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <section className="mt-14">

      {/* Heading */}
      <div className="flex flex-col sm:flex-row justify-between gap-5 mb-6">

        <div>
          <h2 className="text-2xl font-bold">
            Crypto Analytics
          </h2>

          <p className="text-gray-400 text-sm mt-2">
            Historical cryptocurrency price movements
          </p>
        </div>

        <button
          onClick={fetchChart}
          disabled={loading}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-4 py-2 rounded-lg transition"
        >
          <RefreshCw
            size={16}
            className={loading ? 'animate-spin' : ''}
          />
          Refresh Chart
        </button>

      </div>

      {/* Chart Controls */}
      <div className="flex flex-wrap gap-4 justify-between mb-6">

        {/* Coin Selection */}
        <select
          value={coin}
          onChange={(e) => setCoin(e.target.value)}
          className="bg-[#15151f] border border-gray-700 rounded-lg px-4 py-3 text-white outline-none"
        >
          <option value="bitcoin">Bitcoin (BTC)</option>
          <option value="ethereum">Ethereum (ETH)</option>
          <option value="solana">Solana (SOL)</option>
          <option value="binancecoin">BNB</option>
          <option value="ripple">XRP</option>
        </select>

        {/* Time Filters */}
        <div className="flex gap-2">

          {[
            { label: '24H', value: '1' },
            { label: '7D', value: '7' },
            { label: '30D', value: '30' },
          ].map((period) => (
            <button
              key={period.value}
              onClick={() => setDays(period.value)}
              className={`px-4 py-2 rounded-lg text-sm transition ${
                days === period.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-[#15151f] text-gray-400 hover:bg-gray-800'
              }`}
            >
              {period.label}
            </button>
          ))}

        </div>

      </div>

      {/* Selected Coin Summary */}
      {summaryLoading ? (
        <div className="bg-[#15151f] border border-gray-800 rounded-xl p-6 mb-6">
          <p className="text-gray-400">
            Loading market information...
          </p>
        </div>
      ) : summaryError ? (
        <div className="bg-[#15151f] border border-gray-800 rounded-xl p-6 mb-6">
          <p className="text-red-400">
            {summaryError}
          </p>
        </div>
      ) : selectedCoin && (
        <div className="bg-[#15151f] border border-gray-800 rounded-xl p-6 mb-6">

          <div className="flex flex-col sm:flex-row justify-between gap-6">

            {/* Current Price */}
            <div>
              <p className="text-gray-400 text-sm mb-2">
                {selectedCoin.name} Current Price
              </p>

              <h3 className="text-3xl font-bold">
                {formatPrice(selectedCoin.current_price)}
              </h3>
            </div>

            {/* 24 Hour Change */}
            <div>
              <p className="text-gray-400 text-sm mb-2">
                24 Hour Price Change
              </p>

              <div
                className={`flex items-center gap-2 text-xl font-semibold ${
                  selectedCoin.price_change_percentage_24h >= 0
                    ? 'text-green-400'
                    : 'text-red-400'
                }`}
              >

                {selectedCoin.price_change_percentage_24h >= 0
                  ? <TrendingUp size={22} />
                  : <TrendingDown size={22} />
                }

                {selectedCoin.price_change_percentage_24h?.toFixed(2) ?? 'N/A'}%

              </div>
            </div>

          </div>

        </div>
      )}

      {/* Chart Container */}
      <div className="bg-[#15151f] border border-gray-800 rounded-2xl p-5 md:p-7">

        {loading ? (

          <div className="h-[350px] flex flex-col items-center justify-center text-gray-400">
            <RefreshCw className="animate-spin mb-3 text-blue-400" />
            Loading chart data...
          </div>

        ) : error ? (

          <div className="h-[350px] flex flex-col items-center justify-center gap-4">

            <p className="text-red-400">
              {error}
            </p>

            <button
              onClick={fetchChart}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition"
            >
              Try Again
            </button>

          </div>

        ) : chartData.length > 0 ? (

          <ResponsiveContainer width="100%" height={350}>

            <LineChart data={chartData}>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#303040"
              />

              <XAxis
                dataKey="time"
                tickFormatter={formatDate}
                stroke="#888899"
                minTickGap={35}
                tick={{ fontSize: 11 }}
              />

              <YAxis
                stroke="#888899"
                tickFormatter={(value) => `$${value.toLocaleString()}`}
                width={85}
                tick={{ fontSize: 11 }}
                domain={['auto', 'auto']}
              />

              <Tooltip
                contentStyle={{
                  backgroundColor: '#15151f',
                  border: '1px solid #374151',
                  borderRadius: '10px',
                  color: '#fff',
                }}
                labelFormatter={(value) =>
                  new Date(value).toLocaleString()
                }
                formatter={(value) => [
                  formatPrice(value),
                  'Price',
                ]}
              />

              <Line
                type="monotone"
                dataKey="price"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 5 }}
              />

            </LineChart>

          </ResponsiveContainer>

        ) : (

          <div className="h-[350px] flex items-center justify-center text-gray-400">
            No chart data available.
          </div>

        )}

      </div>

    </section>
  )
}

export default CryptoChart
