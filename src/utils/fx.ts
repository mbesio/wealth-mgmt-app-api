// rateTable example, filter all the rates for that date
// EUR/USD
// AED/USD optional

// const exampleRateTable = {
//   "EUR/USD": 1.05415,
//   "AED/USD": 0.272257,
// }

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

// console.log(fxRate("EUR", "EUR", exampleRateTable))
// console.log(fxRate("AED", "AED", exampleRateTable))
// console.log(fxRate("USD", "USD", exampleRateTable))
// console.log(fxRate("AED", "EUR", exampleRateTable))
// console.log(fxRate("AED", "USD", exampleRateTable))
// console.log(fxRate("EUR", "AED", exampleRateTable))
// console.log(fxRate("USD", "AED", exampleRateTable))


export const getFxRateTable = (fxRates) => fxRates.reduce((acc, item) => {
  const pair = item.pair
  const rate = item.rate
  return acc = {
    ...acc,
    [pair]: rate
  }
}, {})