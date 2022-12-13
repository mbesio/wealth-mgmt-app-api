import filter from 'lodash.filter'
import { FX } from '@prisma/client'
import { getFxRateTable, getFxRate } from '../utils/fx'

export const combineAssetsWithCurrencies = (inputAssetsFromPrimsa, fxFromPrisma) => {

  return inputAssetsFromPrimsa.map( inputAsset => {
    const fxRates : FX[] = filter(fxFromPrisma, {date: inputAsset.date})
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
}