import prisma from "../server/db"
import filter from 'lodash.filter'
import { getFxRate, getFxRateTable } from "../utils/fx"


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


//memoize this function
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
  const outputDates = startDateISO.toISOString()
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



    output.push({date: new Date(startDateISO.setMonth(startDateISO.getMonth() + 1)).toISOString() ,principal: Math.round(currentPrincipal)})
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
  const timeseriesWithCurrencies = timeseries.map( timestamp => {

    const { date, principal } = timestamp
    const fxRates = filter(fx, {date: date})
    const fxRateTable = getFxRateTable(fxRates)
    const amountEUR = getFxRate(currency, "EUR", fxRateTable) * principal
    const amountUSD = getFxRate(currency, "USD", fxRateTable) * principal
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

