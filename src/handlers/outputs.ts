import prisma from '../server/db'
import filter from 'lodash.filter'
import { FX } from '@prisma/client'
import { getFxRateTable, getFxRate, combineByDate } from '../utils/fx'
import { getInputLiabilitesTimeSeries } from '../utils/liabilities'

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
  const timeseriesAssets = combineByDate(inputAssetsWithCurrencies)
  const timeseriesLiabilites = await getInputLiabilitesTimeSeries()
  console.log('timeseriesLiabilites ', timeseriesLiabilites)

  const inputLiabilitiesWithCurrencies = timeseriesLiabilites.map(item => item.timeseries).flat()
  const timeseriesLiabilities = combineByDate(inputLiabilitiesWithCurrencies)

  const datesAssets = timeseriesAssets.map(item => item.date)
  const amountEURAssets = timeseriesAssets.map(item => item.amountEUR)
  const amountUSDAssets = timeseriesAssets.map(item => item.amountUSD)

  const datesLiabilites = timeseriesLiabilities.map(item => item.date)
  const amountEURLiabilites = timeseriesLiabilities.map(item => item.amountEUR)
  const amountUSDLiabilites = timeseriesLiabilities.map(item => item.amountUSD)

  // calculate the net worth

  res.json({
    data: {
      netWorth: {

      },
      assets: {
        dates: datesAssets,
        amountEUR: amountEURAssets,
        amountUSD: amountUSDAssets
      },
      liabilities: {
        dates: datesLiabilites,
        amountEUR: amountEURLiabilites,
        amountUSD: amountUSDLiabilites
      }
    }
  })
}

export const getSummaryMetrics = async (req, res) => {

}