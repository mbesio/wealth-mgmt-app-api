import prisma from '../server/db'
import filter from 'lodash.filter'
import { FX } from '@prisma/client'
import { getFxRateTable, getFxRate, combineAssetsByDate } from '../utils/fx'

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

  // need to add the liabilities part
  const timeseries = combineAssetsByDate(inputAssetsWithCurrencies)

  const dates = timeseries.map(item => item.date)
  const amountEUR = timeseries.map(item => item.amountEUR)
  const amountUSD = timeseries.map(item => item.amountUSD)

  res.json({
    data: {
      dates,
      assets: {
        amountEUR,
        amountUSD
      },
      liabilities: {}
    }
  })
}

export const getSummaryMetrics = async (req, res) => {

}