import prisma from '../server/db'
import find from 'lodash.find'
import { combineAmountsByDate, combineDates } from '../utils/outputs'

export const getTimeseries = async (req, res) => {
  const inputAssets = await prisma.inputAssets.findMany({})
  const inputLiabilities = await prisma.inputLiabilities.findMany({})

  // Map to {date, amountEUR, amountUSD}
  const inputAssetsEURUSD = inputAssets.map((input) => {
    const { date, amount, fxVsUSD, fxVsEUR } = input
    return {
      date,
      amountUSD: amount * fxVsUSD,
      amountEUR: amount * fxVsEUR,
    }
  })

  const inputLiabilitiesEURUSD = inputLiabilities.map((input) => {
    const { date, remainingPrincipal, fxVsUSD, fxVsEUR } = input
    return {
      date,
      amountUSD: remainingPrincipal * fxVsUSD,
      amountEUR: remainingPrincipal * fxVsEUR,
    }
  })

  // Sum by date
  const inputAssetsEURUSDByDate = combineAmountsByDate(inputAssetsEURUSD)
  const inputLiabilitiesEURUSDByDate = combineAmountsByDate(
    inputLiabilitiesEURUSD
  )

  // combine asset and input dates
  const dates = combineDates(
    inputAssetsEURUSDByDate,
    inputLiabilitiesEURUSDByDate
  )

  // map assets and liabilites to combined dates
  const timeseries = dates.map((item) => {
    const assets = find(inputAssetsEURUSDByDate, { date: item.date }) || 0
    const liabilites =
      find(inputLiabilitiesEURUSDByDate, { date: item.date }) || 0
    return {
      date: item.date,
      assets: assets,
      liabilities: liabilites,
      netWorth: assets - liabilites,
    }
  })

  res.json({
    data: timeseries,
  })
}

export const getSummaryMetrics = async (req, res) => {
  const currentDateObj = await prisma.inputAssets.findMany({
    orderBy: [
      {
        date: 'desc',
      },
    ],
    take: 1,
  })
  const currentDate = currentDateObj[0].date
  const currentAssets = await prisma.inputAssets.findMany({
    where: {
      date: currentDate,
    },
    include: {
      belongsTo: true,
    },
  })
  const currentLiabilites = await prisma.inputLiabilities.findMany({
    where: {
      date: currentDate,
    },
    include: {
      belongsTo: true,
    },
  })

  const currentAssetsUSDEUR = currentAssets.map((item) => {
    return {
      name: item.belongsTo.name,
      category: item.belongsTo.category,
      currency: item.belongsTo.currency,
      amountUSD: item.amount * item.fxVsUSD,
      amountEUR: item.amount * item.fxVsEUR,
    }
  })

  const currentLiabilitiesUSDEUR = currentLiabilites.map((item) => {
    return {
      name: item.belongsTo.name,
      currency: item.belongsTo.currency,
      amountUSD: item.remainingPrincipal * item.fxVsUSD,
      amountEUR: item.remainingPrincipal * item.fxVsEUR,
    }
  })

  res.json({
    data: {
      date: currentDate,
      assets: currentAssetsUSDEUR,
      liabilities: currentLiabilites,
    },
  })
}
