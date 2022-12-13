import axios from 'axios'

export const getfxRateAPI = async (date, currency) => {
const apikey = process.env.API_KEY
const config = {
  headers: {
    apikey: apikey
  }
}

const url = `https://api.apilayer.com/exchangerates_data/${date}?base=${currency}&symbols=USD`
const rate = await axios.get(url, config)
return rate.data.rates.USD
}