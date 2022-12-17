import dayjs from 'dayjs'

const periodsDifference = (firstDate, secondDate) => {
  const fitstDateDayjs = dayjs(firstDate)
  const secondDateDayjs = dayjs(secondDate)

  return fitstDateDayjs.diff(secondDateDayjs, 'month')
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