import prisma from "../server/db"

export const getAccountsAssets = async (req, res) => {

  const accountAssets = await prisma.accountAssets.findMany()
  res.json({data: accountAssets})
}

export const getAccountsLiabilities = async (req, res) => {

  const accountLiabilities = await prisma.accountLiabilities.findMany()
  res.json({data: accountLiabilities})
}

export const createAccountAssets = async (req, res) => {

  const accountAsset = await prisma.accountAssets.create({
    data: {
      name: req.body.name,
      currency: req.body.currency,
      category: req.body.category
  }})

  res.json({data: accountAsset})
}

export const createAccountLiabilities = async (req, res) => {

  const accountLiabilities = await prisma.accountLiabilities.create({
    data: {
      name: req.body.name,
      currency: req.body.currency,
      principal: req.body.principal,
      interestRate: req.body.interestRate,
      startDate: req.body.startDate,
      term: req.body.term,
  }})

  res.json({data: accountLiabilities})
}