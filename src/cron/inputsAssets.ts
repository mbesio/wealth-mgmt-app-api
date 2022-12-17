import dayjs from 'dayjs'
import prisma from "../server/db"
import nodeCron from 'node-cron'
import {dateForFXAPI, getfxRateAPI } from "../utils/fxapi"

const inputsAssetsCronJob = async () => {
  const currentDate = dayjs()
  const date = dateForFXAPI(currentDate)

  const activeAccountAssets = await prisma.accountAssets.findMany({
    where: {
      isActive: true
    }
  })

  activeAccountAssets.forEach( async (asset) => {
    const latestInput = await prisma.inputAssets.findMany({
      where: {
        belongsToAccountId: asset.id
      },
      orderBy: [{
        date: 'desc'
      }],
        take: 1
      })

    const currency = asset.currency // TO DO - refactor with lodash get

    const newFxVsUSD = currency === 'USD' ? 1 : await getfxRateAPI(date, currency, 'USD')
    const newFxVsEUR = currency === 'EUR' ? 1 : await getfxRateAPI(date, currency, 'EUR')
    console.log('newFxVsUSD ', newFxVsUSD )
    console.log('newFxVsEUR ', newFxVsEUR )

    const newInput = await prisma.inputAssets.create({
      data: {
        date,
        amount: latestInput[0].amount,
        fxVsUSD: newFxVsUSD,
        fxVsEUR: newFxVsEUR,
        belongsToAccountId: asset.id
      }
    })
    console.log('cronjob completed - ', newInput)
  })
}

export const launchInputAssetsCronJob = () => {
  const inputAssetCronSchedule = nodeCron.schedule("0 5 1 * *", inputsAssetsCronJob, {
    scheduled: true,
    timezone: "America/Los_Angeles"
  })
  inputAssetCronSchedule.start()
}



// Get the list of active asset accounts from the DB
// loop through the array of AccountAssets
  // get the laters input asset of that account
  // based on the currency call the api to get FX vs USD and EUR
  // for the current date, add a new record in the input assets table with the following fields
    // date (YYYY-MM-DD) -this will be the date the cron job runs, i.e. first of the month
    // amount -this will be the amount from the previous monhth (user will then be able to update)
    // fxVsUSD - what called from the api
    // fxVsEUR - what called from the api
    // belongsToAccountId - what pulled from the account before
