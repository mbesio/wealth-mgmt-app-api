import axios from 'axios'

export const getfxRateAPI = async (date, currency) => {
  console.log('hello from axios - getfxRateAPI')
const apikey = process.env.API_KEY
const config = {
  headers: {
    apikey: apikey
  }
}

const url = `https://api.apilayer.com/exchangerates_data/${date}?base=${currency}&symbols=USD`
console.log('hello from axios - getfxRateAPI - url ', url)
const rate = await axios.get(url, config)
console.log('hello from axios - getfxRateAPI - rate ', rate)
return rate.data.rates.USD
}