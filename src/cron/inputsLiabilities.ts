import dayjs from 'dayjs'
import prisma from '../server/db'
import nodeCron from 'node-cron'
import get from 'lodash.get'
import { formtDate, getfxRateAPI } from '../utils/fxapi'
import { outstandingPrincipal } from '../utils/liabilities'

const inputsLiabilitiesCronJob = async () => {
  const currentDate = dayjs()
  const currentDateFormatted = formtDate(currentDate)

  const activeLiabiliteisAccounts = await prisma.accountLiabilities.findMany({
    where: {
      isActive: true,
    },
  })

  activeLiabiliteisAccounts.forEach(async (liability) => {
    const currency = get(liability, 'currency')
    let newFxVsUSD
    let newFxVsEUR
    try {
      newFxVsUSD =
        currency === 'USD'
          ? 1
          : await getfxRateAPI(currentDateFormatted, currency, 'USD')
      newFxVsEUR =
        currency === 'EUR'
          ? 1
          : await getfxRateAPI(currentDateFormatted, currency, 'EUR')
    } catch (e) {
      console.log('error in the catch block', e)
    }

    const startDate = dayjs(get(liability, 'startDate'))
    const startDateFormatted = formtDate(startDate)
    const originalPrincipal = get(liability, 'principal')
    const interestRate = get(liability, 'interestRate')
    const term = get(liability, 'term')

    const newPrincipal = outstandingPrincipal(
      currentDateFormatted,
      startDateFormatted,
      originalPrincipal,
      interestRate,
      term
    )

    const newInput = await prisma.inputLiabilities.create({
      data: {
        date: currentDateFormatted,
        remainingPrincipal: newPrincipal,
        fxVsUSD: newFxVsUSD,
        fxVsEUR: newFxVsEUR,
        belongsToAccountId: liability.id,
      },
    })
  })
}

export const launchInputLiabilitiesCronJob = () => {
  const inputLiabilitiesCronSchedule = nodeCron.schedule(
    '0 5 1 * *',
    inputsLiabilitiesCronJob,
    {
      scheduled: true,
      timezone: 'America/Los_Angeles',
    }
  )
  inputLiabilitiesCronSchedule.start()
}
