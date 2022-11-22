import React, { useEffect, useRef, useState } from 'react'
import moment from 'moment'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  Tooltip,
  YAxis,
  XAxis,
  CartesianGrid,
} from 'recharts'
import { useDebounceEffect } from 'ahooks'
import { formatDate } from 'utils/dates'
import PremiumPriceOracle, {
  genLineData,
  MAX_PREMIUM_USD,
} from './PremiumPriceOracle'
import './style/premiumPrice.css'

const formatValue = (v, fixed = 3) => {
  const number = Number(v.toFixed(fixed))
  return new Intl.NumberFormat().format(number)
}
const TooltipComponent = (props) => {
  const { payload } = props
  return (
    <>
      {payload?.length ? (
        <div className="text-xs bg-fill-5 px-2 py-1 rounded-lg backdrop-blur-sm">
          <span>${formatValue(payload[0]?.payload.value, 2)}</span>
          <br />
          <span className="font-normal">
            {moment(payload[0]?.payload.time).format('YYYY.MM.DD')} |{' '}
            {moment(payload[0]?.payload.time).format('HH:mm (UTCZ)')}
          </span>
        </div>
      ) : null}
    </>
  )
}
const YTick = (props) => {
  const { y, fill, payload, tickFormatter } = props
  return (
    <text
      y={y}
      fill={fill}
      dy="0.355em"
      className="recharts-cartesian-axis-tick-value"
    >
      {tickFormatter(payload.value)}
    </text>
  )
}

const xTickFormatter = (v) => {
  return moment(v).format('D MMM')
}
const yTickFormatter = (v) => {
  return (
    '$' +
    new Intl.NumberFormat('en', {
      notation: 'compact',
    }).format(v)
  )
}

const PremiumCountdown = ({ endTime }) => {
  const [count, setCount] = useState('')
  useEffect(() => {
    let timer
    if (endTime) {
      timer = window.setInterval(() => {
        const duration = moment.duration(endTime.diff(moment()))
        const days = duration.days().toString().padStart(2, '0')
        const hours = duration.hours().toString().padStart(2, '0')
        const minutes = duration.minutes().toString().padStart(2, '0')
        const seconds = duration.seconds().toString().padStart(2, '0')
        setCount(`${days}:${hours}:${minutes}:${seconds}`)
      }, 1000)
    }
    return () => window.clearInterval(timer)
  }, [endTime])

  return (
    <p className="text-right">
      End in <br className="md:hidden" />{' '}
      <span className="inline-block w-[58px] md:text-left">{count}</span>
    </p>
  )
}

export default function PremiumPrice({ expiryTime, ethUsdPrice }) {
  const [data, setData] = useState([])
  const [inputPremium, setInputPremium] = useState(0)
  const [dateWithInput, setDateWithInput] = useState('-')
  const [currentPrice, setCurrentPrice] = useState({
    usd: '0.00',
    bnb: '0.000',
  })
  const oracle = useRef()
  const handleInputChange = (e) => {
    const num = parseFloat(e.target.value)
    if (!Number.isNaN(num) && num <= MAX_PREMIUM_USD) {
      setInputPremium(Math.max(num, 0))
      const date = oracle.current?.getTargetDateByAmount(num)
      setDateWithInput(formatDate(date))
    }
  }
  useDebounceEffect(
    () => {
      if (inputPremium && inputPremium > 0) {
        const date = oracle.current?.getTargetDateByAmount(inputPremium)
        let index = -1
        let lastIndex = -1
        const newData = [...data]
        for (let i = 0; i < newData.length; i++) {
          if (newData[i].select !== undefined) {
            lastIndex = i
          }
          const t = newData[i].value
          if (index < 0 && inputPremium >= t) {
            index = i - 1
          }
        }
        if (lastIndex >= 0) {
          delete newData[lastIndex].select
        }
        if (index >= 0) {
          if (newData[index].value === inputPremium) {
            newData[index].select = inputPremium
          } else {
            newData.splice(index, 0, {
              value: inputPremium,
              select: inputPremium,
              time: date,
            })
          }
          setData(newData)
        }
      }
    },
    [inputPremium],
    { wait: 1500 }
  )
  useEffect(() => {
    if (expiryTime) {
      const exDate = moment(expiryTime)
      oracle.current = new PremiumPriceOracle(exDate)
      const temp = genLineData(oracle.current)
      setData(temp)
      setInputPremium(0)
      const date = oracle.current?.getTargetDateByAmount(0)
      setDateWithInput(formatDate(date))
      const current = temp.find((v) => v.current !== undefined)
      setCurrentPrice({
        bnb: formatValue(current.value / ethUsdPrice),
        usd: formatValue(current.value, 2),
      })
    }
  }, [expiryTime])

  return (
    <>
      <div className="md:w-[640px] w-[312px] rounded-2xl p-5 bg-fill-2 mt-4">
        <p className="text-primary md:text-xl text-lg font-bold text-center mb-1">
          This domain has a<br className="md:hidden" /> temporary premium
        </p>
        <p className="text-sm font-semibold break-all text-center">
          To ensure every user has a fair opportunity to register a newly
          expired name, these names will have a premium that starts at
          $100,000,000 and reduces exponentially until it reaches $0 over 21
          days. Enter the amount you are willing to pay as premium to learn the
          exact time to register.
        </p>
        <div className="flex justify-between text-green-600 text-xs font-semibold mt-5 mb-4">
          <p>
            Buy now at
            <br className="md:hidden" /> {currentPrice.bnb} BNB ($
            {currentPrice.usd})
          </p>
          <PremiumCountdown endTime={oracle.current?.zeroPremiumDate} />
        </div>
        <div className="w-full h-[134px] premium-chart">
          <ResponsiveContainer>
            <LineChart data={data}>
              <XAxis
                dataKey="time"
                type="number"
                stroke="#B1D6D3"
                tickLine={false}
                axisLine={false}
                domain={['dataMin', 'dataMax']}
                tickCount={5}
                interval="preserveStartEnd"
                tickFormatter={xTickFormatter}
                height={11}
              />
              <YAxis
                dataKey="value"
                type="number"
                stroke="#B1D6D3"
                tickLine={false}
                axisLine={false}
                tick={<YTick />}
                hide={!data.length}
                interval={0}
                width={29}
                tickFormatter={yTickFormatter}
              />
              <CartesianGrid
                stroke="rgba(67, 140, 136, 0.25)"
                strokeWidth={1}
                vertical={false}
                horizontal={data.length > 0}
              />
              <Tooltip
                content={<TooltipComponent />}
                wrapperStyle={{ outline: 'none' }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#1EEFA4"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="pastValue"
                stroke="#D9D9D9"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="current"
                stroke="#1EEFA4"
                strokeWidth={2}
                dot={{ fill: '#1EEFA4', radius: 4 }}
              />
              <Line
                type="monotone"
                dataKey="select"
                stroke="white"
                dot={{ fill: '#FFFFFF', radius: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="my-8 flex justify-center space-x-4">
        <div>
          <input
            value={inputPremium}
            onChange={handleInputChange}
            className="px-2 py-1 text-center text-sm font-semibold w-[120px] rounded-lg bg-fill-5 focus:outline-none focus-visible:outline-none"
            type="number"
            max={MAX_PREMIUM_USD}
          />
          <p className="md:mt-1 mt-5 text-green-600 text-xs font-semibold text-center">
            Premium ($)
          </p>
        </div>
        <p className="text-2xl font-normal">=</p>
        <div>
          <p className="text-center text-sm font-semibold md:px-[10px] md:py-1 md:w-auto w-[120px]">
            {dateWithInput}
          </p>
          <p className="mt-1 text-green-600 text-xs font-semibold text-center">
            Date and time shown
            <br className="md:hidden" /> in local time zone
          </p>
        </div>
      </div>
    </>
  )
}
