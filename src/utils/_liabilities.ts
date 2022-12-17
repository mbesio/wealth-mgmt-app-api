import prisma from "../server/db"
import filter from 'lodash.filter'
import { getFxRate, getFxRateEUR, getFxRateTable, getFxRateUSD } from "../utils/fx"

//calculate outstanding principal of a loan based on terms and current date
const periodsDifference = (firstDate, secondDate) => {
  const firstDateToISO = new Date(firstDate)
  const firstDateYear = firstDateToISO.getFullYear()
  const firstDateMonths = firstDateToISO.getMonth()

  const secondDateToISO = new Date(secondDate)
  const secondDateYear = secondDateToISO.getFullYear()
  const secondDateMonths = secondDateToISO.getMonth()
   return (secondDateYear - firstDateYear) * 12 + (secondDateMonths - firstDateMonths)
}

//TO - DO memoize this function
export const outstandingPrincipal = (currentDate, startDate, originalPrincipal, interestRate, term) => {
  const monthsSinceIssuance = periodsDifference(startDate, currentDate)
  if (monthsSinceIssuance === 0) {
    return originalPrincipal
  }
  const monthlyPayment = (originalPrincipal * interestRate) / (12*(1-(1+(interestRate/12))**(-12*term)))
  let currentPrincipal = originalPrincipal
  let monthlyInterestPayment
  let monthlyPrincipalPayment

  for (let i = 0; i < monthsSinceIssuance; i++) {
    monthlyInterestPayment = currentPrincipal * interestRate / 12
    monthlyPrincipalPayment = monthlyPayment - monthlyInterestPayment
    currentPrincipal = currentPrincipal - monthlyPrincipalPayment

  }
  return Math.max(Math.round(currentPrincipal), 0)
}

export const outstandingPrincipalSeries = (currentDate, startDate, originalPrincipal, interestRate, term) => {
  const startDateISO = new Date(startDate)
  const outputDates = startDateISO.toISOString().substring(0,10)
  const output = [{date: outputDates, principal: originalPrincipal }]

  const monthsSinceIssuance = periodsDifference(startDate, currentDate)
  if (monthsSinceIssuance === 0) {
    return originalPrincipal
  }

  const monthlyPayment = (originalPrincipal * interestRate) / (12*(1-(1+(interestRate/12))**(-12*term)))
  let currentPrincipal = originalPrincipal
  let monthlyInterestPayment
  let monthlyPrincipalPayment

  for (let i = 0; i < monthsSinceIssuance; i++) {
    monthlyInterestPayment = currentPrincipal * interestRate / 12
    monthlyPrincipalPayment = monthlyPayment - monthlyInterestPayment
    currentPrincipal = currentPrincipal - monthlyPrincipalPayment

    output.push({date: new Date(startDateISO.setMonth(startDateISO.getMonth() + 1)).toISOString().substring(0,10) ,principal: Math.round(currentPrincipal)})
  }
  return output
}

// const currentDate =  '2022-12-01T08:00:00.000Z'
// const startDate =  '2018-12-01T08:00:00.000Z'
// const originalPrincipal =  15000
// const interestRate =  0.015
// const term =  25

// console.log('output ', outstandingPrincipalSeries(currentDate, startDate, originalPrincipal, interestRate, term))

export const getInputLiabilitesTimeSeries = async () => {
  const liabilities = await prisma.accountLiabilities.findMany()

const fx = await prisma.fX.findMany()

const currentDate = new Date().toISOString()
const timeseriesOutput = liabilities.map(liability => {
  const startDate = liability.startDate
  const principal = liability.principal
  const interestRate = liability.interestRate
  const currency = liability.currency
  const term = liability.term
  const timeseries = outstandingPrincipalSeries(currentDate, startDate, principal, interestRate, term)
  const timeseriesWithCurrencies = timeseries.map( async timestamp => {

    const { date, principal } = timestamp
    const fxRates = filter(fx, {date: date})
    const fxRateTable = getFxRateTable(fxRates)

    const fxRateUSD = getFxRateUSD(currency, fxRateTable, date)
    const fxRateEUR = getFxRateEUR(currency, fxRateTable, date, fxRateUSD)

    const amountEUR = await fxRateUSD * principal
    const amountUSD = await fxRateEUR * principal
    return {
      date,
      amountEUR,
      amountUSD
    }
  })
  return {
    startDate,
    principal,
    interestRate,
    term,
    timeseries: timeseriesWithCurrencies
  }
})
return timeseriesOutput
}

export const getLiabilitesAsOfDate = async (date) => {
  const liabilities = await prisma.accountLiabilities.findMany()

  const fx = await prisma.fX.findMany()
  const isoDate = date.toISOString()

  const liabilitiesWithCurrencies = liabilities.map( async liability => {
  const startDate = liability.startDate
  const principal = liability.principal
  const interestRate = liability.interestRate
  const currency = liability.currency
  const term = liability.term
  const currentPrincipal = outstandingPrincipal(isoDate, startDate, principal, interestRate, term)
  const fxRates = filter(fx, {date: isoDate})
  const fxRateTable = getFxRateTable(fxRates)

  const fxRateUSD = await getFxRateUSD(currency, fxRateTable, isoDate)
  const fxRateEUR = await getFxRateEUR(currency, fxRateTable, isoDate, fxRateUSD)

  const amountEUR = fxRateUSD * currentPrincipal
  const amountUSD = fxRateEUR * currentPrincipal

  return {
    amountEUR: amountEUR,
    amountUSD: amountUSD,
  }
})

const output = Promise.all(liabilitiesWithCurrencies).then(
  result => {
    let amountEUR = 0
    let amountUSD = 0
    for (let i = 0; i < result.length; i++ ) {
      amountEUR += result[i].amountEUR
      amountUSD += result[i].amountUSD
    }
    return {
      amountEUR,
      amountUSD
    }
  })
  return output
}

