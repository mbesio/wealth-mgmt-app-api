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

export const getFxRateTable = (fxRates) => fxRates.reduce((acc, item) => {
  const pair = item.pair
  const rate = item.rate
  return acc = {
    ...acc,
    [pair]: rate
  }
}, {})

export const combineAssetsByDate = input => {
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