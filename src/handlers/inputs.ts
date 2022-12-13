import prisma from "../server/db"
import { getfxRateAPI } from "../utils/fxapi"
import { getInputLiabilitesTimeSeries } from "../utils/liabilities"

export const getInputAssets = async (req, res) => {
  const rate =  await getfxRateAPI('2020-12-25', 'EUR')
  const inputAssets = await prisma.inputAssets.findMany({
    include: {
      belongsTo: true
    }
  })
  // TO DO - clean up response and add FX conversion
  res.json({data: inputAssets})
}

export const getInputLiabilites = async (req, res) => {
  const inputLiabilitesTimeSeries = await getInputLiabilitesTimeSeries()
  res.json({data: inputLiabilitesTimeSeries })
}

export const createInputAssets = async (req, res) => {

  const inputAssets = await prisma.inputAssets.create({
    data: {
      date: req.body.date,
      amount: req.body.amount,
      belongsToAccountId: req.body.belongsToAccountId
    }
  })
  res.json({data: inputAssets})
}

export const createInputLiabilities = async (req, res) => {

  const inputLiabilities = await prisma.inputLiabilities.create({
    data: {
      date: req.body.date,
      remainingPrincipal: req.body.remainingPrincipal,
      belongsToAccountId: req.body.belongsToAccountId
    }
  })
  res.json({data: inputLiabilities})
}


export const createFx = async (req, res) => {

  const fx = await prisma.fX.create({
    data: {
      date: req.body.date,
      pair: req.body.pair,
      rate: req.body.rate
    }
  })
  res.json({data: fx})
}