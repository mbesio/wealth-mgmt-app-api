import prisma from '../server/db'
import { combineByDate } from '../utils/fx'
import { getInputLiabilitesTimeSeries } from '../utils/liabilities'
import { calculateNetWorthOutput, combineTimeSeriesDates } from '../utils/combinetimeseries'
import { combineAssetsWithCurrencies } from '../utils/inputs'

export const getTimeseries = async (req, res) => {

  const inputAssets = await prisma.inputAssets.findMany({
    include: {
      belongsTo: true
    }
  })
  const fx = await prisma.fX.findMany()

  const inputAssetsWithCurrencies = combineAssetsWithCurrencies(inputAssets, fx)

  const timeseriesAssets = combineByDate(inputAssetsWithCurrencies)
  const timeseriesLiabilites = await getInputLiabilitesTimeSeries()

  const inputLiabilitiesWithCurrencies = timeseriesLiabilites.map(item => item.timeseries).flat()
  const timeseriesLiabilities = combineByDate(inputLiabilitiesWithCurrencies)

  const datesAssets = timeseriesAssets.map(item => item.date.toISOString().substring(0,10))
  const amountEURAssets = timeseriesAssets.map(item => item.amountEUR)
  const amountUSDAssets = timeseriesAssets.map(item => item.amountUSD)

  const datesLiabilites = timeseriesLiabilities.map(item => item.date)
  const amountEURLiabilites = timeseriesLiabilities.map(item => item.amountEUR)
  const amountUSDLiabilites = timeseriesLiabilities.map(item => item.amountUSD)

  const assets = {
    dates: datesAssets,
    amountEUR: amountEURAssets,
    amountUSD: amountUSDAssets
  }

  const liabilities = {
    dates: datesLiabilites,
    amountEUR: amountEURLiabilites,
    amountUSD: amountUSDLiabilites
  }

  const combinedDates = combineTimeSeriesDates(assets.dates, liabilities.dates)
  const combinedTimeseries = calculateNetWorthOutput(combinedDates, assets, liabilities)

  res.json({
    data:
    {
      timeseries: combinedTimeseries,
    }
  })
}

export const getSummaryMetrics = async (req, res) => {
  console.log('hello from getSummaryMetrics')
  const currentDateObj = await prisma.inputAssets.findFirst({
    orderBy: [{
      date: 'desc',
    }],
    take: 1
  })
  const currentDate = currentDateObj.date
  const currentAssets = await prisma.inputAssets.findMany({
    where: {
      date: currentDate
    },
    include: {
      belongsTo: true
    }
  })
  const fx = await prisma.fX.findMany()
  const inputAssetsWithCurrencies = combineAssetsWithCurrencies(currentAssets, fx)

  // TO DO - need to get the value of the liabiliy for this date


  res.json({data: inputAssetsWithCurrencies})
}