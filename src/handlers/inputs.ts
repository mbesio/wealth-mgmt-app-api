import prisma from "../db"

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