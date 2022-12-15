import prisma from "../server/db"

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
    }
  })
    res.json({data: accountAsset})
}

export const getAccountsAssets = async (req, res) => {
  const accountAssets = await prisma.accountAssets.findMany()
  res.json({data: accountAssets})
}

export const toggleIsActiveAccountAssets = async (req, res) => {
  const { id } = req.params
  const { isActive } = req.body
  const accountAsset = await prisma.accountAssets.update({
    where: {
      id: id
    },
    data: {
      isActive
    }
  })
  res.json({data: accountAsset})
}


export const deleteAccountAssets = async (req, res) => {
  const { id } = req.params
  await prisma.accountAssets.delete({
    where: {
      id
    }
  })
  res.json({data: `Account Asset ${id} succesfully deleted`})
}