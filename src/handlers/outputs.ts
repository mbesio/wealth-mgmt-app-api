import prisma from '../server/db'
// import find from 'lodash.find'
import filter from 'lodash.filter'
import { FX } from '@prisma/client'
import { getFxRateTable, getFxRate } from '../utils/fx'

export const getTimeseries = async (req, res) => {

  const inputAssets = await prisma.inputAssets.findMany({
    include: {
      belongsTo: true
    }
  })
  const fx = await prisma.fX.findMany()

  const inputAssetsWithCurrencies = inputAssets.map( inputAsset => {
    const fxRates : FX[] = filter(fx, {date: inputAsset.date})
    const fxRateTable = getFxRateTable(fxRates)
    const currency = inputAsset.belongsTo.currency
    const amountEUR = getFxRate(currency, "EUR", fxRateTable) * inputAsset.amount
    const amountUSD = getFxRate(currency, "USD", fxRateTable) * inputAsset.amount
    return {
      date: inputAsset.date,
      amountEUR: amountEUR,
      amountUSD: amountUSD
    }
  })

  const helper = {}
  const groupDates = inputAssetsWithCurrencies.reduce((acc, item)=> {
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

  const dates = groupDates.map(item => item.date)
  const amountEUR = groupDates.map(item => item.amountEUR)
  const amountUSD = groupDates.map(item => item.amountUSD)

  res.json({
    data: {
      dates,
      amountEUR,
      amountUSD
    }
  })
}