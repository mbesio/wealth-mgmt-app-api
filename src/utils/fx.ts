import prisma from "../server/db"
import { FX } from "@prisma/client"
import { getfxRateAPI } from "./fxapi"

export const getFxRate = (inputCurrency, outputCurrency, rateTable) => {
  if(inputCurrency === outputCurrency) {
    return 1
  }
  if(outputCurrency === 'USD') {
    return rateTable[`${inputCurrency}/USD`]
  }
  if(inputCurrency === "USD") {
    return 1 / rateTable[`${outputCurrency}/USD`]
  }
  return rateTable[`${inputCurrency}/USD`] * 1 / rateTable[`${outputCurrency}/USD`]
}

export const getFxRateTable = (fxRates: FX[]) => fxRates.reduce((acc, item) => {
  const pair = item.pair
  const rate = item.rate
  return acc = {
    ...acc,
    [pair]: rate
  }
}, {})

type CombineByDateInput = {
  date: Date
  amountEUR: Number
  amountUSD: Number
}

export const combineByDate = (input : CombineByDateInput[]) : CombineByDateInput[] => {
  const helper = {}
  return input.reduce((acc, item)=> {
    var key = item.date.toString()
    if(!helper[key]) {
      helper[key] = Object.assign({}, item)
      acc.push(helper[key])
    } else {
      helper[key].amountEUR += item.amountEUR
      helper[key].amountUSD += item.amountUSD
    }
    return acc
  }, [])
}


export const getFxRateUSD = async (currency, fxRateTable, date) => {
  let output = getFxRate(currency, "USD", fxRateTable)
  if(!output) {
    console.log('date before throwing in USD', date)
    const dateForFunction = typeof date === 'string' ? date : date.toISOString()
    const ratefromAPI = await getfxRateAPI(dateForFunction.substring(0,10), currency)

    await prisma.fX.create({
      data: {
        date: date,
        pair: `${currency}/USD`,
        rate: ratefromAPI
      }
    })
    output = ratefromAPI
  }
  return output
}

export const getFxRateEUR = async (currency, fxRateTable, date, fxRateUSD) => {
  let output = getFxRate(currency, "EUR", fxRateTable)
  if(!output) {
    const dateForFunction = typeof date === 'string' ? date : date.toISOString()
    const ratefromAPI = await getfxRateAPI(dateForFunction.substring(0,10), "EUR")
    await prisma.fX.create({
      data: {
        date: date,
        pair: 'EUR/USD',
        rate: ratefromAPI
      }
    })
    output = fxRateUSD / ratefromAPI
  }
  return output
}