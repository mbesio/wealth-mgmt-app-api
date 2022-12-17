import prisma from '../server/db'

// called by the cron job
export const createInputLiabilities = async (req, res) => {
  const { date, remainingPrincipal, fxVsUSD, fxVsEUR, belongsToAccountId } =
    req.body

  const inputLiabilites = await prisma.inputLiabilities.create({
    data: {
      date,
      remainingPrincipal,
      fxVsUSD,
      fxVsEUR,
      belongsToAccountId,
    },
  })
  res.json({ data: inputLiabilites })
}

export const getInputLiabilites = async (req, res) => {
  const inputLiabilities = await prisma.inputLiabilities.findMany({
    include: {
      belongsTo: true,
    },
  })
  res.json({ data: inputLiabilities })
}
