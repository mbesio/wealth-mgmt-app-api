import dayjs from 'dayjs'
import prisma from "../server/db"
import nodeCron from 'node-cron'
import get from 'lodash.get'
import {formtDate, getfxRateAPI} from "../utils/fxapi"
import { outstandingPrincipal } from '../utils/liabilities'

const inputsLiabilitiesCronJob = async () => {
  const currentDate = dayjs()
  const date = formtDate(currentDate)

  const activeLiabiliteisAccounts = await prisma.accountLiabilities.findMany({
    where: {
      isActive: true
    }
  })

  activeLiabiliteisAccounts.forEach(async (liability) => {

    const currency = get(liability, 'currency')
    const newFxVsUSD = currency === 'USD' ? 1 : await getfxRateAPI(date, currency, 'USD')
    const newFxVsEUR = currency === 'EUR' ? 1 : await getfxRateAPI(date, currency, 'EUR')

    const startDate = dayjs(get(liability, 'startDate'))
    const originalPrincipal = get(liability, 'principal')
    const interestRate = get(liability, 'interestRate')
    const term = get(liability, 'term')

    const newPrincipal = outstandingPrincipal(currentDate, startDate, originalPrincipal, interestRate, term)

    const newInput = await prisma.inputLiabilities.create({
      data: {
        date,
        remainingPrincipal: newPrincipal,
        fxVsUSD: newFxVsUSD,
        fxVsEUR: newFxVsEUR,
        belongsToAccountId: liability.id
      }
    })
    console.log('cronjob liabilities completed - ', newInput)
  })
}

export const launchInputLiabilitiesCronJob = () => {
  const inputLiabilitiesCronSchedule = nodeCron.schedule("0 5 1 * *", inputsLiabilitiesCronJob, {
    scheduled: true,
    timezone: "America/Los_Angeles"
  })
  inputLiabilitiesCronSchedule.start()
}


// get Liability accounts
// loop over the accounts
  // calculate the principal for the month
  // get fx rate for the date
  // add input liability for the date