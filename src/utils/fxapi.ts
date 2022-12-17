import axios from 'axios'
import { Dayjs } from 'dayjs'

export const formtDate = (dayjsdate: Dayjs) => `${dayjsdate.year()}-${dayjsdate.month()+1}-${dayjsdate.date()}`

const getfxRateAPINoMemoize = async (date, currency, currencyBase) => {
  const apikey = process.env.API_KEY
  const config = {
    headers: {
      apikey: apikey
    }
  }
  const url = `https://api.apilayer.com/exchangerates_data/${date}?base=${currency}&symbols=${currencyBase}`
  const rate = await axios.get(url, config)
  return rate.data.rates.USD
}

const constructPropertyFromArgs = (fn, args) => {
  let propToCheck = []
  propToCheck = propToCheck.concat(fn.name, args)
  return propToCheck.join('|')
}

const memoize = (fn) => {
  const cache = {}
  return async (...args) => {
    const inputArgs = constructPropertyFromArgs(fn, args)
    if(!cache[inputArgs]) {
      cache[inputArgs] = await fn(...args)
    }
    return cache[inputArgs]
  }
}

export const getfxRateAPI = memoize(getfxRateAPINoMemoize)