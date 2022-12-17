import findIndex from 'lodash.findindex'
import union from 'lodash.union'

/**
 * Combines an array by the dates
 * @param arrayDatesEURUSD is {
 *  date: string,
 *  amountUSD: number,
 *  amountEUR: number
 * }
 * @returns array with the same object structure as input but summing per same dates
 */
export const combineAmountsByDate = (arrayDatesEURUSD) => {
  return arrayDatesEURUSD.reduce((acc, item) => {
    const currentDateIndex = findIndex(acc, { date: item.date })
    if (currentDateIndex < 0) {
      const newElement = {
        date: item.date,
        amountUSD: item.amountUSD,
        amountEUR: item.amountEUR,
      }
      acc.push(newElement)
    } else {
      acc[currentDateIndex].amountUSD = item.amountUSD
      acc[currentDateIndex].amountEUR = item.amountEUR
    }
    return acc
  }, [])
}

export const combineDates = (dateArray1, dateArray2) => {
  const combinedDates = union(dateArray1, dateArray2)
  return combinedDates.sort((a, b) => (a < b ? -1 : a > b ? 1 : 0))
}
