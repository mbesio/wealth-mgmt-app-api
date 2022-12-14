import prisma from "../server/db"

export const getAccountsAssets = async (req, res) => {
  const accountAssets = await prisma.accountAssets.findMany()
  res.json({data: accountAssets})
}

export const getAccountsLiabilities = async (req, res) => {
  res.json({data: 'hello from getAccountsLiabilities'})
}

export const createAccountAssets = async (req, res) => {
  const { name, currency, category, startDate, isActive } = req.body
  // TO DO - add input validation
  const accountAsset = await prisma.accountAssets.create({
    data: {
      name,
      currency,
      category,
      startDate,
      isActive
  }})
  res.json({data: accountAsset})
}

export const createAccountLiabilities = async (req, res) => {

  res.json({data: 'hello from createAccountLiabilities'})
}

export const deleteAccountLiabilities = async (req, res) => {

  res.json({data: 'hello from deleteAccountLiabilities'})
}