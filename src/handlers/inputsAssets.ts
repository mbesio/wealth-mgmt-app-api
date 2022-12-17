import prisma from '../server/db'

// this will be called by a cron job every month
// the cron job will pass 1) belongsToAccountId; 2) date; 3) fxEUR 4) fxUSD and will pass the previous month principal that the user can then update with a put
export const createInputAssets = async (req, res) => {
  const { date, amount, fxVsUSD, fxVsEUR, belongsToAccountId } = req.body

  const inputAssets = await prisma.inputAssets.create({
    data: {
      date,
      amount,
      fxVsUSD,
      fxVsEUR,
      belongsToAccountId,
    },
  })
  res.json({ data: inputAssets })
}

export const getInputAssets = async (req, res) => {
  const inputAssets = await prisma.inputAssets.findMany({
    include: {
      belongsTo: true,
    },
  })
  res.json({ data: inputAssets })
}

export const updateInputAssetAmount = async (req, res) => {
  const { id } = req.params
  const { amount } = req.body
  const inputAsset = await prisma.inputAssets.update({
    where: {
      id: id,
    },
    data: {
      amount,
    },
  })
  res.json({ data: inputAsset })
}
