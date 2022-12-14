import filter from 'lodash.filter'
import { FX } from '@prisma/client'
import { getFxRateTable, getFxRateUSD, getFxRateEUR } from '../utils/fx'

export const combineAssetsWithCurrencies = (inputAssetsFromPrimsa, fxFromPrisma) => {

  const output = inputAssetsFromPrimsa.map( async (inputAsset) => {
    const fxRates : FX[] = filter(fxFromPrisma, {date: inputAsset.date})
    const fxRateTable = getFxRateTable(fxRates)
    const currency = inputAsset.belongsTo.currency

    const fxRateUSD = getFxRateUSD(currency, fxRateTable, inputAsset.date)
    const fxRateEUR = getFxRateEUR(currency, fxRateTable, inputAsset.date, fxRateUSD)

    const amountEUR = await fxRateUSD * inputAsset.amount
    const amountUSD = await fxRateEUR * inputAsset.amount
    return {
      date: inputAsset.date,
      amountEUR: amountEUR,
      amountUSD: amountUSD
    }
  })
  return output
}