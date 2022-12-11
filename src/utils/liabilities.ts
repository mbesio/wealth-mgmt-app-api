//calculate outstanding principal of a loan based on terms and current date
export const outstandingPrincipal = (currentDate, startDate, originalPrincipal, interestRate, term ) => {
  const monthsSinceIssuance = periodsDifference(startDate, currentDate)
  if (monthsSinceIssuance === 0) {
    return originalPrincipal
  }
  const monthlyPayment = (originalPrincipal * interestRate) / (12*(1-(1+(interestRate/12))^(-12*term)))
  let currentPrincipal = originalPrincipal
  let monthlyInterestPayment
  let monthlyPrincipalPayment

  for (let i = 0; i < monthsSinceIssuance; i++) {
    monthlyInterestPayment = currentPrincipal * interestRate
    monthlyPrincipalPayment = monthlyPayment - monthlyInterestPayment
    currentPrincipal = currentDate - monthlyPrincipalPayment
  }
  return currentPrincipal
}
// Matteo to test the outstandingPrincipal function


const date1 = '2010-01-11T04:42:24.182Z'
const date2 = '2012-09-11T04:42:24.182Z'

const periodsDifference = (firstDate, secondDate) => {
  const firstDateToISO = new Date(firstDate)
  const firstDateYear = firstDateToISO.getFullYear()
  const firstDateMonths = firstDateToISO.getMonth()

  const secondDateToISO = new Date(secondDate)
  const secondDateYear = secondDateToISO.getFullYear()
  const secondDateMonths = secondDateToISO.getMonth()
   return (secondDateYear - firstDateYear) * 12 + (secondDateMonths - firstDateMonths)
}
console.log(periodsDifference(date1, date2))