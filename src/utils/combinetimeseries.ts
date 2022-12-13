import union from 'lodash.union'

export const combineTimeSeriesDates = (dateArray1, dateArray2) => {
  const combinedDates = union(dateArray1, dateArray2)
  return combinedDates.sort((a ,b) => (a < b) ? -1 : ((a > b) ? 1 : 0))
}

export const calculateNetWorthOutput = (dates, assets, liabilites) => {
  return dates.reduce((acc, date) => {
    const assetIndex = assets.dates.indexOf(date)
    const assetEUR = assetIndex < 0 ? 0 : assets.amountEUR[assetIndex]
    const assetUSD = assetIndex < 0 ? 0 : assets.amountUSD[assetIndex]

    const liabilityIndex = liabilites.dates.indexOf(date)
    const liabilityEUR = liabilityIndex < 0 ? 0 : liabilites.amountEUR[liabilityIndex]
    const liabilityUSD = liabilityIndex < 0 ? 0 : liabilites.amountUSD[liabilityIndex]

    const netWorthEUR = assetEUR - liabilityEUR
    const netWorthUSD = assetUSD - liabilityUSD

    const assetsEUR = [...acc.assets.amountEUR, assetEUR]
    const assetsUSD = [...acc.assets.amountUSD, assetUSD]

    const liabilitesEUR = [...acc.liabilites.amountEUR, liabilityEUR]
    const liabilitesUSD = [...acc.liabilites.amountUSD, liabilityUSD]

    const newNetWorthEUR = [...acc.netWorth.amountEUR, netWorthEUR]
    const newNetWorthUSD = [...acc.netWorth.amountUSD, netWorthUSD]

    return {
      dates,
      assets: {
        amountEUR: assetsEUR,
        amountUSD: assetsUSD
      },
      liabilites: {
        amountEUR: liabilitesEUR,
        amountUSD: liabilitesUSD
      },
      netWorth: {
        amountEUR: newNetWorthEUR,
        amountUSD: newNetWorthUSD
      }
    }
  },{
    dates,
    assets: {
      amountEUR: [],
      amountUSD: []
    },
    liabilites: {
      amountEUR: [],
      amountUSD: []
    },
    netWorth: {
      amountEUR: [],
      amountUSD: []
    }
  })
}