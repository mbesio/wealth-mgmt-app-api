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

export const outstandingPrincipal = (currentDate, startDate, originalPrincipal, interestRate, term ) => {
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