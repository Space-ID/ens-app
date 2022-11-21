import moment from 'moment'

const HOUR = 60 * 60
const DAY = HOUR * 24
const FACTOR = 0.5
export const MAX_PREMIUM_USD = 100000000
export default class PremiumPriceOracle {
  constructor(expiryDate, algorithm) {
    this.algorithm = algorithm ?? 'exponential'
    if (algorithm === 'linear') {
      this.startingPremiumInUsd = 100000
      this.totalDays = 28
    } else {
      this.startingPremiumInUsd = MAX_PREMIUM_USD
      this.totalDays = 21
      this.lastValue = this.startingPremiumInUsd * FACTOR ** this.totalDays
    }
    this.releasedDate = expiryDate.clone().add(90, 'days')
    this.zeroPremiumDate = this.releasedDate.clone().add(this.totalDays, 'days')
    this.diff = this.zeroPremiumDate.diff(this.releasedDate)
    this.rate = this.startingPremiumInUsd / this.diff
    this.diffInHour = this.zeroPremiumDate.diff(this.releasedDate, 'hour')
    this.diffInDay = this.zeroPremiumDate.diff(this.releasedDate, 'days')
    this.hourlyRate = this.startingPremiumInUsd / this.diffInHour
  }

  getDaysPast(currentDate) {
    return parseInt(currentDate.diff(this.releasedDate) / DAY / 1000)
  }

  getHoursPast(currentDate) {
    return parseInt(currentDate.diff(this.releasedDate) / HOUR / 1000)
  }

  getDaysRemaining(currentDate) {
    return this.totalDays - this.getDaysPast(currentDate)
  }

  getHoursRemaining(currentDate) {
    return this.totalDays * 24 - this.getHoursPast(currentDate)
  }

  getTargetDateByAmount(amount) {
    if (this.algorithm === 'exponential') {
      let daysPast
      if (amount < this.lastValue) {
        daysPast = this.totalDays
      } else {
        daysPast =
          Math.log((amount + this.lastValue) / this.startingPremiumInUsd) /
          Math.log(FACTOR)
      }
      const r = this.releasedDate.clone().add(daysPast * 24 * 60, 'minutes')
      return r
    } else {
      return this.zeroPremiumDate
        .clone()
        .subtract(amount / this.rate / 1000, 'second')
    }
  }

  getTargetAmountByDaysPast(daysPast) {
    if (this.algorithm === 'exponential') {
      const premium = this.startingPremiumInUsd * FACTOR ** daysPast
      if (premium >= this.lastValue) {
        return premium
      } else {
        return 0
      }
    } else {
      return (this.totalDays - daysPast) * (this.hourlyRate * 24)
    }
  }

  getAmountByDateRange(startDate, currentDate) {
    let hoursPast = currentDate.diff(startDate) / HOUR / 1000
    let daysPast = hoursPast / 24
    return this.getTargetAmountByDaysPast(daysPast)
  }
}

export function genLineData(oracle) {
  const data = []
  const now = moment()
  const currentAmount = oracle.getAmountByDateRange(
    oracle.releasedDate.clone(),
    now
  )
  for (let i = 0; i < oracle.diffInHour; i++) {
    const value = oracle.getTargetAmountByDaysPast(i / 24)
    const time = oracle.releasedDate.clone().add(i, 'h')
    const temp = { value, time: time.valueOf() }
    if (i > 0) {
      if (value === currentAmount) {
        temp.current = value
      } else if (
        currentAmount < data[data.length - 1].value &&
        currentAmount > value
      ) {
        data.push({
          value: currentAmount,
          time: now.valueOf(),
          current: currentAmount,
        })
      }
    }
    if (now.isSameOrAfter(time)) {
      temp.pastValue = value
    }
    data.push(temp)
  }
  return data
}
